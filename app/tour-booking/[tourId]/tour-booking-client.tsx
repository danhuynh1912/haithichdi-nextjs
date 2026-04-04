'use client';

import { memo, useActionState, useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { tourService, TourDetail, BookingPayload } from '@/lib/services/tour';
import { saveBookingId } from '@/lib/services/booking-storage';
import { isAxiosError } from 'axios';
import { formatDateDdMm } from '@/lib/utils';
import {
  Calendar,
  MapPin,
  Phone,
  Mail,
  User,
  AlertTriangle,
  ChevronLeft,
  LoaderCircle,
} from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { useQuery } from '@tanstack/react-query';
import { BookingFlowHeader } from '../components/booking-flow-header';
import BackgroundBlur from '@/app/locations/components/background-blur';
import PdfPreviewCard from '@/components/pdf-preview-card';
import { useIsMobile } from '@/lib/hooks/use-is-mobile';

type BookingFormState =
  | { status: 'idle'; message?: string; redirectTo?: undefined; bookingId?: undefined }
  | { status: 'success'; message: string; redirectTo: string; bookingId: number }
  | { status: 'error'; message: string; redirectTo?: undefined; bookingId?: undefined };

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
  const isMobile = useIsMobile();
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

  const pdfUrl = tour?.location?.quotation_file_url || null;

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
        <p className='text-lg'>
          Không tìm thấy tour hoặc tour đã ngừng hoạt động.
        </p>
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

          <h1 className='text-2xl md:text-4xl font-black uppercase tracking-tight'>
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

        {isMobile ? (
          <div className='w-full rounded-3xl border border-white/10 bg-neutral-900 overflow-hidden shadow-2xl'>
            <PdfPreviewCard
              pdfUrl={pdfUrl}
              title={`Quotation - ${tour.location.name}`}
              className='w-full border-0 rounded-none shadow-none'
              emptyMessage='Chưa có file quotation cho địa điểm này.'
              thumbnailUrl={tour.location.full_image_url}
              mobileCtaLabel='Xem lịch trình và báo giá'
            />
            <BookingForm
              tourId={tourId}
              locationName={tour.location.name}
              embeddedMobile
            />
          </div>
        ) : (
          <div className='flex flex-col md:flex-row gap-6'>
            <PdfPreviewCard
              pdfUrl={pdfUrl}
              title={`Quotation - ${tour.location.name}`}
              className='w-full md:w-1/2 md:min-h-[60vh]'
              frameClassName='w-full h-full min-h-[60vh]'
              emptyMessage='Chưa có file quotation cho địa điểm này.'
            />
            <BookingForm tourId={tourId} locationName={tour.location.name} />
          </div>
        )}
      </div>
    </main>
  );
}

const BookingForm = memo(function BookingForm({
  tourId,
  locationName,
  embeddedMobile = false,
}: {
  tourId: number;
  locationName: string;
  embeddedMobile?: boolean;
}) {
  const router = useRouter();
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
        const booking = await tourService.createBooking(payload);
        return {
          status: 'success',
          message: 'Đăng ký thành công! Đang chuyển sang màn hình xác nhận...',
          redirectTo: `/tour-booking/${tourId}/success`,
          bookingId: booking.id,
        };
      } catch (err: unknown) {
        console.error(err);
        let apiMessage: string | undefined;
        if (isAxiosError(err)) {
          const data = err.response?.data as
            | { phone?: string[]; detail?: string; message?: string }
            | undefined;
          apiMessage = data?.phone?.[0] || data?.detail || data?.message;
        }
        return {
          status: 'error',
          message: apiMessage || 'Đăng ký thất bại, vui lòng thử lại.',
        };
      }
    },
    initialFormState,
  );

  useEffect(() => {
    if (formState.status !== 'success') return;
    saveBookingId(formState.bookingId);
    router.push(formState.redirectTo);
  }, [formState, router]);

  return (
    <div
      className={`w-full flex flex-col gap-6 ${
        embeddedMobile
          ? 'bg-transparent border-0 rounded-none shadow-none p-5'
          : 'md:w-1/2 bg-neutral-900 border border-white/10 rounded-3xl shadow-2xl p-5 md:p-8'
      }`}
    >
      <div className='flex flex-col gap-1'>
        <h2 className='text-2xl font-black text-white'>Đăng ký ngay</h2>
        <p className='text-neutral-400 text-sm'>
          Để lại thông tin, đội ngũ {locationName} sẽ liên hệ xác nhận.
        </p>
      </div>

      {formState.status === 'success' && (
        <div className='flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#d00600]/15 border border-[#d00600]/40 text-[#d00600] text-sm'>
          <LoaderCircle size={18} className='animate-spin' />
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
    'w-full min-w-0 max-w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-base md:text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#d00600] transition-colors';

  return (
    <label className='flex flex-col gap-2 text-sm text-neutral-300 min-w-0'>
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
          className={`${inputClasses} ${type === 'date' ? 'appearance-none' : ''}`}
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
