'use client';

import Image from 'next/image';
import { AnimatePresence, motion } from 'motion/react';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { leaderService, type Leader } from '@/lib/services/leader';
import { ANIMATION_EASE } from '@/lib/constants';
import { cn } from '@/lib/utils';
import {
  ArrowUpRight,
  BadgeCheck,
  Calendar,
  Camera,
  Flame,
  Heart,
  MapPin,
  Sparkles,
  Users,
  X,
} from 'lucide-react';

type LeaderCard = Leader & {
  role_label?: string;
  relationship?: string;
  dob?: string;
  highlight?: string;
  location?: string;
};

const storyParagraphs = [
  'Ngày trước, mình chỉ đơn giản là một người mê núi, mê rừng, mê cái cảm giác hít căng lồng ngực bầu không khí trong lành và thả hồn theo những biển mây trôi lững lờ. Rồi mình chợt nghĩ: Nếu chỉ mình mình được thấy thì… uổng quá. Giá mà có thêm nhiều người cùng đi, cùng trải nghiệm thì tuyệt biết bao!',
  'Từ ý nghĩ đó, mình bắt đầu hành trình dẫn tour trekking. Với mình, trekking không chỉ là đi bộ trên những con đường mòn gập ghềnh, mà còn là hành trình kết nối những tâm hồn. Nơi mà ta có thể tạm quên deadline, gác lại phố thị ồn ào, chỉ còn tiếng cười vang quanh đống lửa, những câu hát ngẫu hứng và những câu chuyện thật lòng chưa từng dám kể.',
  'Và mình tin, giá trị của một chuyến đi không chỉ nằm ở cảnh đẹp. Thỉnh thoảng, chúng mình mang theo vài món quà nhỏ gửi tặng các em nhỏ vùng cao như chút bánh kẹo, quyển vở,... để san sẻ niềm vui.',
  'Nhưng quan trọng hơn, chính những chuyến trekking còn mở ra cơ hội để bà con trên bản có thêm việc làm, thêm nguồn thu nhập sau vụ mùa vất vả. Họ trở thành những người porter âm thầm gùi đồ, khéo léo nấu nướng, kiên nhẫn dẫn đường… không chỉ giúp chuyến đi trọn vẹn hơn, mà còn để lại trong chúng mình sự biết ơn và những kỷ niệm khó quên.',
  '💚 Với mình, một chuyến đi trọn vẹn phải có đủ ba điều: Trekking – Kết nối – Thiện nguyện. Và mình tin, nếu bạn đồng hành cùng Hải Thích Đi, bạn sẽ không chỉ thấy thiên nhiên hùng vĩ hơn, tâm hồn mình rộng mở hơn, mà còn mang về một góc nhìn mới về con người, về cuộc sống, và có khi… về chính bản thân mình.',
];

const fallbackLeaders: LeaderCard[] = [
  {
    id: -1,
    username: 'kieu.trinh',
    first_name: 'Nguyễn Thị',
    last_name: 'Kiều Trinh',
    full_name: 'Nguyễn Thị Kiều Trinh',
    avatar_url:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
    role_label: 'Trek Leader',
    relationship: 'Single',
    dob: '13/05/1998',
    highlight:
      'Hơn 5 năm dẫn đoàn, mạnh thể lực, xử lý tình huống nhanh nhạy và luôn giữ không khí vui vẻ.',
    strengths: [
      'Thể lực bền bỉ',
      'Kĩ năng quay/chụp',
      'Khả năng dẫn đoàn',
      'Xử lý tình huống',
      'Hài hước, kết nối',
    ],
    bio: 'Một trong những nữ leader sở hữu thể lực tốt và khả năng ứng biến mượt mà, luôn quan tâm và giữ tinh thần đoàn.',
  },
  {
    id: -2,
    username: 'minh.trek',
    first_name: 'Nguyễn',
    last_name: 'Minh',
    full_name: 'Nguyễn Minh',
    avatar_url:
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
    role_label: 'Route Architect',
    relationship: 'Married',
    dob: '04/11/1992',
    strengths: ['Định tuyến', 'An toàn', 'Sơ cứu', 'Logistics'],
    highlight: 'Thiết kế cung đường tối ưu và đảm bảo an toàn cho từng đoàn.',
    bio: 'Đam mê bản đồ, luôn thử nghiệm lộ trình mới để giữ an toàn và trải nghiệm trọn vẹn.',
  },
  {
    id: -3,
    username: 'lan.hoang',
    first_name: 'Hoàng',
    last_name: 'Lan',
    full_name: 'Hoàng Lan',
    avatar_url:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80&sat=-40',
    role_label: 'Community Host',
    relationship: 'Single',
    dob: '22/08/1995',
    strengths: ['Giao tiếp bản địa', 'Ẩm thực địa phương', 'Gắn kết đội'],
    highlight: 'Kết nối với cộng đồng địa phương và đem đến trải nghiệm văn hóa.',
    bio: 'Luôn mỉm cười, luôn lắng nghe; người khiến mọi cuộc trò chuyện quanh lửa trại trở nên đáng nhớ.',
  },
];

const galleryImages = [
  { src: '/images/tachinhu1.jpg', alt: 'Tà Chì Nhù biển mây', width: 1600, height: 2000 },
  { src: '/images/haithichdi1.jpg', alt: 'Hải Thích Đi hành trình', width: 1600, height: 900 },
  {
    src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80',
    alt: 'Đỉnh núi rực hoàng hôn',
    width: 900,
    height: 1200,
  },
  {
    src: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&q=80',
    alt: 'Cắm trại trong rừng',
    width: 900,
    height: 1100,
  },
  {
    src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
    alt: 'Hồ trên mây',
    width: 900,
    height: 1100,
  },
  {
    src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80&sat=-20',
    alt: 'Sườn núi đêm',
    width: 900,
    height: 1100,
  },
];

export default function AboutClient() {
  const { data: leaders = [], isLoading: leadersLoading } = useQuery({
    queryKey: ['leaders'],
    queryFn: leaderService.getLeaders,
  });

  const mergedLeaders = useMemo<LeaderCard[]>(() => {
    if (leaders.length === 0) return fallbackLeaders;
    return leaders.map((leader) => ({
      ...leader,
      role_label: leader.display_role || 'Leader',
      avatar_url: leader.full_avatar_url || leader.avatar_url,
    }));
  }, [leaders]);

  const [selectedLeader, setSelectedLeader] = useState<LeaderCard | null>(null);

  return (
    <main className='bg-black text-white overflow-hidden'>
      <StorySection />
      <LeadersSection
        leaders={mergedLeaders}
        loading={leadersLoading}
        onSelect={setSelectedLeader}
      />
      <GallerySection />
      <LeaderModal leader={selectedLeader} onClose={() => setSelectedLeader(null)} />
    </main>
  );
}

function StorySection() {
  return (
    <section className='relative min-h-screen flex items-center bg-gradient-to-b from-black via-[#0b0b0b] to-[#0a0a0a]'>
      <div className='pointer-events-none absolute inset-0'>
        <div className='absolute top-10 left-[-10%] w-[320px] h-[320px] bg-red-500/20 blur-[120px]' />
        <div className='absolute bottom-0 right-[-10%] w-[380px] h-[380px] bg-[#ff7b47]/20 blur-[140px]' />
        <div className='absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_top,_rgba(255,80,80,0.08),transparent_45%)]' />
      </div>

      <div className='relative z-10 max-w-[1400px] mx-auto px-4 sm:px-8 py-20 grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center'>
        <div className='space-y-6'>
          <div className='inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.2em] text-red-200'>
            <Sparkles className='w-4 h-4 text-red-400' />
            Về chúng tôi
          </div>
          <h1 className='text-4xl sm:text-5xl lg:text-6xl font-black leading-tight'>
            Trekking. Kết nối. Thiện nguyện.
          </h1>
          <p className='text-red-200/90 text-lg font-medium'>
            Hành trình Hải Thích Đi được viết từ những biển mây, bếp lửa đêm và những
            cái ôm tạm biệt ở bản làng.
          </p>

          <div className='space-y-4 text-sm sm:text-base text-neutral-200 leading-relaxed max-w-3xl'>
            {storyParagraphs.map((paragraph, idx) => (
              <motion.p
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, ease: ANIMATION_EASE, delay: idx * 0.05 }}
                className={cn(idx === storyParagraphs.length - 1 && 'font-semibold text-red-100')}
              >
                {paragraph}
              </motion.p>
            ))}
          </div>

          <div className='flex flex-wrap gap-3 pt-4'>
            {['Trekking', 'Kết nối', 'Thiện nguyện'].map((pill) => (
              <span
                key={pill}
                className='inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs uppercase tracking-[0.15em] text-red-100'
              >
                <BadgeCheck className='w-4 h-4 text-red-400' />
                {pill}
              </span>
            ))}
          </div>
        </div>

        <div className='relative'>
          <div className='absolute inset-0 -left-6 -top-6 rounded-[36px] border border-white/10 bg-gradient-to-br from-red-500/15 via-transparent to-white/5' />
          <div className='relative overflow-hidden rounded-[32px] border border-white/10 shadow-2xl shadow-red-900/30'>
            <Image
              src='/images/haithichdi1.jpg'
              alt='Hải Thích Đi trekking'
              width={1200}
              height={1400}
              className='h-full w-full object-cover'
              priority
            />
            <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6'>
              <p className='text-sm text-red-100 uppercase tracking-[0.2em] mb-1'>Hải Thích Đi</p>
              <p className='text-xl font-semibold'>“Mỗi hành trình là một sợi dây kết nối mới.”</p>
            </div>
          </div>
          <motion.div
            className='absolute -left-6 -bottom-8 bg-black border border-white/10 rounded-2xl px-4 py-3 shadow-lg shadow-red-900/20 flex items-center gap-3'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: ANIMATION_EASE }}
            viewport={{ once: true }}
          >
            <Users className='w-5 h-5 text-red-400' />
            <div>
              <p className='text-xs text-neutral-400'>Đoàn đã đồng hành</p>
              <p className='font-semibold text-lg'>5000+ trekkers</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function LeadersSection({
  leaders,
  loading,
  onSelect,
}: {
  leaders: LeaderCard[];
  loading: boolean;
  onSelect: (leader: LeaderCard) => void;
}) {
  return (
    <section className='relative min-h-screen bg-[#0b0b0b] border-t border-white/5 py-16 sm:py-20 lg:py-24'>
      <div className='pointer-events-none absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,rgba(255,80,80,0.12),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(255,120,80,0.12),transparent_30%)]' />
      <div className='relative max-w-[1400px] mx-auto px-4 sm:px-8 space-y-10'>
        <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-6'>
          <div>
            <p className='text-xs uppercase tracking-[0.25em] text-red-200'>Team</p>
            <h2 className='text-3xl sm:text-4xl font-black mt-2'>Leaders của Hải Thích Đi</h2>
            <p className='text-neutral-300 mt-3 max-w-2xl'>
              Những người giữ nhịp cho hành trình, đảm bảo an toàn và lan tỏa năng lượng tích cực cho
              cả đoàn.
            </p>
          </div>
          <div className='inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-neutral-200'>
            <Heart className='w-4 h-4 text-red-400' />
            <span>Chạm để xem profile chi tiết</span>
          </div>
        </div>

        {loading ? (
          <p className='text-neutral-400 text-sm'>Đang tải danh sách leaders...</p>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
            {leaders.map((leader, idx) => (
              <motion.button
                key={leader.id ?? idx}
                onClick={() => onSelect(leader)}
                className='group text-left rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-black/20 to-black/60 p-5 hover:border-red-400/50 hover:shadow-[0_20px_60px_-35px_rgba(255,80,80,0.6)] transition-all duration-300'
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, ease: ANIMATION_EASE, delay: idx * 0.05 }}
              >
                <div className='flex items-center gap-4'>
                  <AvatarBubble name={leader.full_name} src={leader.avatar_url} />
                  <div className='flex-1'>
                    <p className='text-xs uppercase tracking-[0.2em] text-red-200'>
                      {leader.role_label || 'Leader'}
                    </p>
                    <p className='text-lg font-semibold leading-tight'>{leader.full_name}</p>
                    <p className='text-xs text-neutral-400 flex items-center gap-1 mt-1'>
                      <MapPin className='w-3 h-3' />
                      {leader.location || 'Việt Nam'}
                    </p>
                  </div>
                  <ArrowUpRight className='w-4 h-4 text-red-300 opacity-0 group-hover:opacity-100 transition-opacity' />
                </div>

                <p className='text-sm text-neutral-200 mt-4 line-clamp-3'>
                  {leader.highlight || leader.bio || 'Luôn đặt trải nghiệm và an toàn của đoàn lên trước.'}
                </p>

                <div className='mt-4 flex flex-wrap gap-2'>
                  {(leader.strengths && leader.strengths.length > 0
                    ? leader.strengths
                    : ['An toàn', 'Xử lý tình huống', 'Truyền cảm hứng']
                  ).slice(0, 4).map((strength) => (
                    <span
                      key={strength}
                      className='text-xs rounded-full border border-white/10 bg-white/5 px-3 py-1 text-neutral-100'
                    >
                      {strength}
                    </span>
                  ))}
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function LeaderModal({
  leader,
  onClose,
}: {
  leader: LeaderCard | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {leader && (
        <motion.div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className='relative max-w-5xl w-[90vw] bg-gradient-to-br from-[#101010] to-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl'
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.35, ease: ANIMATION_EASE }}
          >
            <button
              onClick={onClose}
              className='absolute right-3 top-3 z-10 rounded-full border border-white/10 bg-black/70 p-2 text-white hover:border-red-400/70 transition'
            >
              <X className='w-4 h-4' />
            </button>

            <div className='grid md:grid-cols-[1.05fr_0.95fr]'>
              <div className='relative min-h-[320px] bg-gradient-to-br from-red-600/60 to-red-800/40'>
                <Image
                  src={leader.avatar_url || '/images/haithichdi1.jpg'}
                  alt={leader.full_name}
                  fill
                  unoptimized
                  sizes='(max-width: 768px) 100vw, 50vw'
                  className='object-cover'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black to-transparent' />
                <div className='absolute bottom-4 left-4 right-4'>
                  <p className='text-xs uppercase tracking-[0.2em] text-red-200'>
                    {leader.role_label || 'Leader'}
                  </p>
                  <p className='text-2xl font-semibold'>{leader.full_name}</p>
                  <div className='flex flex-wrap gap-3 text-xs text-neutral-200 mt-2'>
                    {leader.relationship && (
                      <span className='inline-flex items-center gap-1 bg-black/60 px-3 py-1 rounded-full border border-white/10'>
                        <Heart className='w-3 h-3 text-red-300' />
                        {leader.relationship}
                      </span>
                    )}
                    {leader.dob && (
                      <span className='inline-flex items-center gap-1 bg-black/60 px-3 py-1 rounded-full border border-white/10'>
                        <Calendar className='w-3 h-3' />
                        {leader.dob}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className='p-6 sm:p-8 space-y-4'>
                <div className='flex items-center gap-3 text-sm text-red-200'>
                  <Flame className='w-4 h-4' />
                  <span>
                    {leader.highlight ||
                      'Lan tỏa năng lượng tích cực, bảo vệ an toàn và cảm xúc của cả đoàn.'}
                  </span>
                </div>

                <div className='text-neutral-200 text-sm leading-relaxed space-y-3'>
                  <p>
                    {leader.bio ||
                      'Leader của Hải Thích Đi, yêu rừng núi, giỏi điều phối nhịp đoàn và luôn dành thời gian lắng nghe từng thành viên.'}
                  </p>
                </div>

                <div>
                  <p className='text-xs uppercase tracking-[0.25em] text-red-200'>Strengths</p>
                  <div className='mt-3 flex flex-wrap gap-2'>
                    {(leader.strengths && leader.strengths.length > 0
                      ? leader.strengths
                      : ['Thể lực', 'An toàn', 'Kết nối', 'Ghi hình', 'Xử lý tình huống']
                    ).map((item) => (
                      <span
                        key={item}
                        className='inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-100'
                      >
                        <Camera className='w-3 h-3 text-red-300' />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-3 text-sm text-neutral-300'>
                  <div className='rounded-2xl border border-white/5 bg-white/5 px-3 py-3'>
                    <p className='text-xs uppercase tracking-[0.2em] text-red-200'>Email</p>
                    <p className='font-medium mt-1'>{leader.email || 'hello@haithichdi.vn'}</p>
                  </div>
                  <div className='rounded-2xl border border-white/5 bg-white/5 px-3 py-3'>
                    <p className='text-xs uppercase tracking-[0.2em] text-red-200'>Gia nhập</p>
                    <p className='font-medium mt-1'>
                      {leader.date_joined
                        ? new Date(leader.date_joined).toLocaleDateString('vi-VN')
                        : '—'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function GallerySection() {
  return (
    <section className='relative min-h-screen bg-gradient-to-b from-[#0b0b0b] via-black to-[#050505] border-t border-white/5 py-16 sm:py-20 lg:py-24'>
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(255,80,80,0.08),transparent_30%),radial-gradient(circle_at_90%_20%,rgba(255,140,100,0.08),transparent_28%)] opacity-40' />
      <div className='relative max-w-6xl mx-auto px-4 sm:px-8 space-y-10'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <div>
            <p className='text-xs uppercase tracking-[0.25em] text-red-200'>Khoảnh khắc</p>
            <h2 className='text-3xl sm:text-4xl font-black mt-2'>Những khung hình yêu thích</h2>
            <p className='text-neutral-300 mt-3 max-w-2xl'>
              Chọn layout so le như Pinterest để giữ nhịp tự do, cảm giác phiêu lưu đúng chất trekking.
            </p>
          </div>
          <div className='inline-flex items-center gap-2 text-xs text-neutral-300 bg-white/5 border border-white/10 px-3 py-2 rounded-full'>
            <Camera className='w-4 h-4 text-red-300' />
            <span>Lướt để xem thêm</span>
          </div>
        </div>

        <div className='columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]'>
          {galleryImages.map((img, idx) => (
            <motion.div
              key={idx}
              className='mb-4 break-inside-avoid overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_20px_60px_-35px_rgba(0,0,0,0.7)]'
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: ANIMATION_EASE, delay: idx * 0.03 }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={img.width}
                height={img.height}
                className='w-full h-auto object-cover'
              />
              <div className='p-3 text-sm text-neutral-200 flex items-center justify-between'>
                <span>{img.alt}</span>
                <MapPin className='w-4 h-4 text-red-300' />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AvatarBubble({ name, src }: { name: string; src?: string | null }) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(-2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className='relative w-14 h-14 rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-red-600 to-red-400 text-center flex items-center justify-center text-lg font-semibold text-white shadow-[0_12px_45px_-25px_rgba(255,80,80,0.8)]'>
      {src ? (
        <Image src={src} alt={name} fill sizes='56px' className='object-cover' unoptimized />
      ) : (
        initials
      )}
    </div>
  );
}
