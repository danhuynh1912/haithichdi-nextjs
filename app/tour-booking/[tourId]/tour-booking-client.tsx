'use client';

import { memo, useActionState, useMemo, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { tourService, TourDetail, BookingPayload } from '@/lib/services/tour';
import { formatDateDdMm } from '@/lib/utils';
import {
  Calendar,
  MapPin,
  Phone,
  Mail,
  User,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
} from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { useQuery } from '@tanstack/react-query';
import { BookingFlowHeader } from '../components/booking-flow-header';
import BackgroundBlur from '@/app/locations/components/background-blur';

type BookingFormState =
  | { status: 'idle'; message?: string }
  | { status: 'success'; message: string }
  | { status: 'error'; message: string };

const initialFormState: BookingFormState = { status: 'idle', message: '' };

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type='submit'
      disabled={pending}
      className='w-full py-4 rounded-2xl font-extrabold uppercase tracking-[0.18em] text-sm bg-white text-black hover:bg-[#d00600] hover:text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed'
    >
      {pending ? 'Đang gửi...' : label}
    </button>
  );
}

export default function TourBookingClient({
  tourIdParam,
}: {
  tourIdParam: string;
}) {
  const router = useRouter();
  const tourId = Number(tourIdParam);

  const {
    data: tour,
    isPending,
    isError,
  } = useQuery<TourDetail, Error>({
    queryKey: ['tour-detail', tourId],
    queryFn: () => tourService.getTourDetail(tourId),
    enabled: Number.isFinite(tourId),
  });

  const pdfSrc = useMemo(() => {
    if (!tour?.location?.quotation_file_url) return null;
    const base = tour.location.quotation_file_url;
    const suffix = 'toolbar=0&navpanes=0&scrollbar=0';
    return base.includes('#') ? `${base}&${suffix}` : `${base}#${suffix}`;
  }, [tour?.location?.quotation_file_url]);

  if (isPending) {
    return (
      <main className='min-h-screen bg-black text-white flex items-center justify-center'>
        <div className='w-12 h-12 border-4 border-[#d00600] border-t-transparent rounded-full animate-spin' />
      </main>
    );
  }

  if (isError || !tour) {
    return (
      <main className='min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4 px-6 text-center'>
        <AlertTriangle className='text-[#d00600]' size={36} />
        <p className='text-lg'>Không tìm thấy tour hoặc tour đã ngừng hoạt động.</p>
        <button
          onClick={() => router.back()}
          className='px-4 py-2 rounded-full border border-white/20 text-sm hover:border-white transition-colors flex items-center gap-2'
        >
          <ChevronLeft size={16} />
          Quay lại
        </button>
      </main>
    );
  }

  return (
    <main className='min-h-screen text-white flex flex-col pt-24 px-4 md:px-8'>
      <BackgroundBlur imageUrl={tour.location.full_image_url} />
      <div className='w-full max-w-[1600px] mx-auto pb-10 flex flex-col gap-8'>
        <header className='flex flex-col gap-2'>
          <BookingFlowHeader trail={[`Booking tour ${tour.location.name}`]} />

          <h1 className='text-3xl md:text-4xl font-black uppercase tracking-tight'>
            {tour.title}
          </h1>
          <div className='flex flex-wrap items-center gap-4 text-neutral-400 text-sm'>
            <span className='flex items-center gap-2'>
              <MapPin className='text-[#d00600]' size={16} />
              {tour.location.name}
            </span>
            {tour.start_date && (
              <span className='flex items-center gap-2'>
                <Calendar className='text-[#d00600]' size={16} />
                {formatDateDdMm(tour.start_date)}
                {tour.end_date ? ` - ${formatDateDdMm(tour.end_date)}` : ''}
              </span>
            )}
            <span className='flex items-center gap-2'>
              <UsersIcon />
              Còn {tour.slots_left} chỗ
            </span>
          </div>
        </header>

        <div className='flex flex-col md:flex-row gap-6'>
          <PdfPreview pdfSrc={pdfSrc} locationName={tour.location.name} />
          <BookingForm tourId={tourId} locationName={tour.location.name} />
        </div>
      </div>
    </main>
  );
}

const PdfPreview = memo(function PdfPreview({
  pdfSrc,
  locationName,
}: {
  pdfSrc: string | null;
  locationName: string;
}) {
  return (
    <div className='w-full md:w-1/2 bg-neutral-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl min-h-[60vh]'>
      {pdfSrc ? (
        <iframe
          src={pdfSrc}
          title={`Quotation - ${locationName}`}
          className='w-full h-full'
        />
      ) : (
        <div className='w-full h-full flex flex-col items-center justify-center gap-3 text-neutral-400 px-6 text-center'>
          <FileText className='text-[#d00600]' size={32} />
          <p>Chưa có file quotation cho địa điểm này.</p>
        </div>
      )}
    </div>
  );
});

const BookingForm = memo(function BookingForm({
  tourId,
  locationName,
}: {
  tourId: number;
  locationName: string;
}) {
  const [formState, formAction] = useActionState<BookingFormState, FormData>(
    async (_prev, formData) => {
      const full_name = (formData.get('full_name') || '').toString().trim();
      const phone = (formData.get('phone') || '').toString().trim();
      const email = (formData.get('email') || '').toString().trim();
      const note = (formData.get('note') || '').toString().trim();
      const medal_name = (formData.get('medal_name') || '').toString().trim();
      const dob = (formData.get('dob') || '').toString().trim();
      const citizen_id = (formData.get('citizen_id') || '').toString().trim();

      if (!full_name || !phone || !medal_name || !dob || !citizen_id) {
        return {
          status: 'error',
          message:
            'Vui lòng điền đủ Họ tên, SĐT, Tên in huy chương, Ngày sinh, CCCD.',
        };
      }

      const payload: BookingPayload = {
        tour: tourId,
        full_name,
        phone,
        email: email || undefined,
        note: note || undefined,
        medal_name,
        dob,
        citizen_id,
      };

      try {
        await tourService.createBooking(payload);
        return {
          status: 'success',
          message: 'Đăng ký thành công! Chúng tôi sẽ liên hệ sớm.',
        };
      } catch (err: any) {
        console.error(err);
        const apiMessage =
          err?.response?.data?.phone?.[0] ||
          err?.response?.data?.detail ||
          err?.response?.data?.message;
        return {
          status: 'error',
          message: apiMessage || 'Đăng ký thất bại, vui lòng thử lại.',
        };
      }
    },
    initialFormState,
  );

  return (
    <div className='w-full md:w-1/2 bg-neutral-900 border border-white/10 rounded-3xl shadow-2xl p-6 md:p-8 flex flex-col gap-6'>
      <div className='flex flex-col gap-1'>
        <h2 className='text-2xl font-black text-white'>Đăng ký ngay</h2>
        <p className='text-neutral-400 text-sm'>
          Để lại thông tin, đội ngũ {locationName} sẽ liên hệ xác nhận.
        </p>
      </div>

      {formState.status === 'success' && (
        <div className='flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#d00600]/15 border border-[#d00600]/40 text-[#d00600] text-sm'>
          <CheckCircle2 size={18} />
          <span>{formState.message}</span>
        </div>
      )}
      {formState.status === 'error' && (
        <div className='flex items-center gap-3 px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/40 text-red-400 text-sm'>
          <AlertTriangle size={18} />
          <span>{formState.message}</span>
        </div>
      )}

      <form action={formAction} className='flex flex-col gap-4'>
        <input type='hidden' name='tour' value={tourId} />
        <Field
          name='full_name'
          label='Họ và tên'
          placeholder='Nguyễn Văn A'
          icon={<User size={16} />}
          required
        />
        <Field
          name='medal_name'
          label='Tên in trên huy chương'
          placeholder='VD: NGUYEN VAN A'
          required
        />
        <Field
          name='phone'
          label='Số điện thoại'
          placeholder='09xx xxx xxx'
          icon={<Phone size={16} />}
          required
        />
        <Field name='dob' label='Ngày tháng năm sinh' type='date' required />
        <Field
          name='email'
          label='Email (tuỳ chọn)'
          placeholder='you@example.com'
          icon={<Mail size={16} />}
          type='email'
        />
        <Field
          name='citizen_id'
          label='Căn cước công dân'
          placeholder='012345678901'
          required
        />
        <Field
          name='note'
          label='Ghi chú'
          placeholder='Yêu cầu đặc biệt...'
          textarea
        />
        <SubmitButton label='Đăng ký ngay' />
      </form>
    </div>
  );
});

function Field({
  name,
  label,
  placeholder,
  icon,
  required,
  textarea,
  type = 'text',
}: {
  name: string;
  label: string;
  placeholder?: string;
  icon?: ReactNode;
  required?: boolean;
  textarea?: boolean;
  type?: string;
}) {
  const inputClasses =
    'w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#d00600] transition-colors';

  return (
    <label className='flex flex-col gap-2 text-sm text-neutral-300'>
      <span className='flex items-center gap-2'>
        {icon}
        <span>
          {label} {required && <span className='text-[#d00600]'>*</span>}
        </span>
      </span>
      {textarea ? (
        <textarea
          name={name}
          placeholder={placeholder}
          rows={4}
          className={`${inputClasses} resize-none`}
          required={required}
        />
      ) : (
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          className={inputClasses}
        />
      )}
    </label>
  );
}

function UsersIcon() {
  return (
    <svg
      width='18'
      height='18'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className='text-[#d00600]'
    >
      <path
        d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Zm0 2c-2.67 0-8 1.34-8 4v1h16v-1c0-2.66-5.33-4-8-4Z'
        fill='currentColor'
      />
    </svg>
  );
}
