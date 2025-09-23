'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'


export default function ITDepartmentHome() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [speedMultiplier, setSpeedMultiplier] = useState(1)
  const [heroImages, setHeroImages] = useState<string[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    async function fetch() {
      try {
        const res = await axios.get('/api/hero-images')
        setHeroImages(res.data.images || [])
      } catch (err) {
        console.error('Error fetching images:', err)
      }
    }
    fetch()
  }, [])

  useEffect(() => {
    if (!heroImages.length) return
    const interval = setInterval(() => {
      setCurrentImageIndex(i => (i + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [heroImages])

  useEffect(() => {
    const interceptLinks = () => {
      document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
          e.preventDefault()
          const target = document.querySelector((link as HTMLAnchorElement).getAttribute('href')!)
          if (target) target.scrollIntoView({ behavior: 'smooth' })
          setMobileMenuOpen(false)
        })
      })
    }
    if (typeof window !== 'undefined') interceptLinks()
  }, [])

  const newsItems = [
    { text: '🚀 TechSparks 2025 registrations open!', href: '/events/techsparks' },
    { text: '🎓 Placement drive 15th Sept', href: '/placements/drive-sept' },
    { text: '🏆 DBATU IT wins SIH 2024', href: '/achievements/sih-2024' },
    { text: '🧠 AI Workshop closing soon', href: '/events/ai-workshop' },
    { text: '📢 New curriculum released', href: '/notices/curriculum-update' },
  ]

  return (
    <div className="min-h-screen font-sans bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-orange-300 text-white py-4 px-1 md:px-6 shadow-md">
        <div className="flex flex-wrap items-center justify-center md:justify-center relative max-w-7xl mx-auto">
          {/* Logo on the far left (on all screen sizes) */}
          <div
            className={`absolute left-0 md:left-5 top-1/2 transform -translate-y-1/2 transition-opacity duration-300  md:opacity-100`}
          >
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={50}
              height={50}
              className="rounded-full"
            />
          </div>

          {/* Centered Text */}
          <div className="flex-1 text-center md:text-center sm:text-right pr-2 sm:pr-4 px-12">
            <h1 className="text-base sm:text-lg md:text-xl font-bold leading-tight">
              Department of Information Technology
            </h1>
            <p className="text-xs sm:text-sm md:text-base ">
              Dr. Babasaheb Ambedkar Technological University (DBATU), Lonere, Maharashtra - 402103
            </p>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white sticky top-0 z-50 shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
          <div className="hidden md:flex gap-6 text-sm font-semibold text-gray-700">
            {['About Us', 'Our Legacy', 'Placement Companies', 'Achievements', 'Events', 'Student Union', 'Teachers', 'Students'].map(sec => (
              <a key={sec} href={`#${sec.toLowerCase().replace(/ /g, '-')}`} className="hover:text-orange-500 transition-colors duration-200">{sec}</a>
            ))}
          </div>
          <div className='hidden md:flex gap-6'>
            <a href="/login">Login</a>
            <a href="/signup">Sign Up</a>
          </div>
          <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-2xl text-orange-600"> ☰ </button>
        </div>
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-6 pb-4 space-y-3">
            {['About Us', 'Our Legacy', 'Placement Records', 'Achievements', 'Events', 'Student Union', 'Teachers', 'Students'].map(sec => (
              <a key={sec} href={`#${sec.toLowerCase().replace(/ /g, '-')}`} className="block text-sm text-gray-700 hover:text-orange-600">
                {sec}
              </a>
            ))}
            <hr className="my-2" />
            <Link href="/login" className="flex justify-center text-sm text-orange-600 hover:underline">Login</Link>
            <Link href="/signup" className=" flex justify-center text-sm bg-orange-500 text-white py-1 rounded hover:bg-orange-600">Sign Up</Link>
          </div>
        )}
      </nav>

      {/* News Ticker */}
      <div className="relative bg-orange-50 border-y border-orange-300 py-2 px-4 overflow-hidden">
        <div className="flex items-center gap-2">
          <span className="text-orange-600 font-bold whitespace-nowrap">📢 Latest News:</span>

          {/* Scrolling clickable news */}
          <div className="relative flex-1 overflow-hidden h-6">
            <div
              className="whitespace-nowrap text-sm text-gray-800 font-medium animate-scroll-left flex items-center gap-6"
              style={{
                animationDuration: `${20 / speedMultiplier}s`,
              }}
            >
              {newsItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="hover:underline hover:text-orange-600 transition-colors duration-200"
                >
                  {item.text}
                </Link>
              ))}
            </div>
          </div>

          {/* Speed control */}
          <div className="hidden sm:flex items-center gap-2 text-sm ml-4">
            <label htmlFor="speed" className="text-gray-600">Speed:</label>
            <select
              id="speed"
              className="bg-orange-100 border border-orange-300 rounded px-2 py-1 text-sm"
              value={speedMultiplier}
              onChange={(e) => setSpeedMultiplier(Number(e.target.value))}
            >
              <option value={1}>1x</option>
              <option value={2}>2x</option>
              <option value={3}>3x</option>
              <option value={4}>4x</option>
            </select>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="relative h-[76vh] bg-gray-800 text-white flex items-center pl-10 overflow-hidden" id="about-us">
        {heroImages.length > 0 && (
          <Image
            src={heroImages[currentImageIndex]}
            alt="Hero Slide"
            fill
            className="object-cover opacity-80"
            priority
          />
        )}
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl font-extrabold mb-4 drop-shadow-lg">Department of Information Technology</h1>
          <p className="text-lg drop-shadow-sm">Empowering innovation through excellence and leadership.</p>
        </div>
      </section>

      {/* Content Sections */}
      <Section id="about-us" title="About Us">
        <p className="mb-4">
          The Department of Information Technology focuses on fostering technical excellence and industry-aligned education. We prepare students with core computing skills and emerging tech insights.
        </p>
        <div className="flex flex-col md:flex-row gap-6">
          <Card title="Our Mission">
            To empower students with innovative knowledge, foster creativity, and build solution‑oriented professionals who contribute to the tech‑driven world.
          </Card>
          <Card title="Our Vision">
            To be a leading department in IT education and research, producing globally competent graduates and pioneering technological advancements.
          </Card>
        </div>
      </Section>

      {/* Our Legacy Section */}
      <Section id="our-legacy" title="Our Legacy">
        <p>Since its establishment in 2003, the Department of Information Technology at DBATU has been a cornerstone of innovation and academic excellence. Over the past two decades, the department has nurtured thousands of professionals who have gone on to build successful careers in leading global organizations and research institutions. With a strong foundation in core technical education and an adaptive approach to emerging technologies, the department has consistently maintained high placement records and industry recognition. Our vibrant alumni network, spread across top multinational corporations and prestigious academic circles, continues to reflect the legacy of quality, leadership, and continuous learning that defines the spirit of DBATU’s IT Department</p>
      </Section>

      {/* HoD's Desk Section */}
      <Section id="hod-desk" title="From our HoD's Desk">
        <div className="flex flex-col md:flex-row items-start gap-6 bg-white p-6 border border-gray-200 rounded-lg shadow-md">
          <div className="flex-shrink-0 w-full md:w-1/3">
            <Image
              src="/images/hod.jpg"
              alt="HoD - Dr. Shivaji Rao Jhadhav"
              width={300}
              height={300}
              className="rounded-lg object-cover w-full h-auto"
            />
          </div>
          <div className="w-full md:w-2/3 text-gray-700 text-base leading-relaxed">
            <p className="mb-4">
              It gives me immense pleasure to welcome you to the Department of Information Technology at DBATU. Over the years, our department has grown into a dynamic center for technical education, innovation, and research. We strive to nurture young minds with the skills and mindset needed to thrive in the ever-evolving tech landscape. Our curriculum is aligned with industry demands and our faculty is dedicated to fostering both academic and personal growth. I invite you to explore our achievements, engage with our community, and be a part of our journey toward excellence.
            </p>
            <p className="font-semibold text-orange-700 flex justify-end ">— Dr. Shivaji Rao Jhadhav, Head of Department</p>
          </div>
        </div>
      </Section>

      {/* Placement Companies Section */}
      <Section id="placement-companies" title="Companies to Offer">
        <div className="relative w-full overflow-hidden orbit-mask py-8">
          <div className="flex space-x-12 animate-orbit w-max">
            {[
              '/images/CCTech.png',
              '/images/swissnewater.png',
              '/images/wipro.png',
            ]
              .concat([
                '/images/CCTech.png',
                '/images/swissnewater.png',
                '/images/wipro.png',
              ]) // Duplicate once for seamless loop
              .map((src, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-40 h-24 flex items-center justify-center transition-transform duration-500 hover:scale-110"
                >
                  <Image
                    src={src}
                    alt={`Company ${index}`}
                    width={120}
                    height={60}
                    className="object-contain grayscale hover:grayscale-0 transition-all duration-500"
                  />
                </div>
              ))}
          </div>
        </div>
      </Section>

       {/* Events Section with Cards */}
      <Section id="events" title="Events">
  <Carousel
    items={[
      <ImageCard
        key="1"
        imageSrc="/images/events/techsparks.jpg"
        title="TechSparks 2025"
        description="Annual tech fest featuring coding competitions, robotics, and speaker sessions."
      />,
      <ImageCard
        key="2"
        imageSrc="/images/events/ai-workshop.jpg"
        title="AI & Robotics Workshop"
        description="Hands-on learning with industry experts in Artificial Intelligence and Robotics."
      />,
      <ImageCard
        key="3"
        imageSrc="/images/events/hackathon.jpg"
        title="Hackathons & Seminars"
        description="Join year-round hackathons, webinars, and guest lectures on emerging tech."
      />,
    ]}
    visibleCards={3}
  />
      </Section>

      {/* Hall of Fame Section with Cards */}
      <Section id="hall-of-fame" title="Hall of Fame">
  <Carousel
    items={[
      <ImageCard
        key="1"
        imageSrc="/images/ekta.png"
        title="Dr. Aditi Sharma"
        description="Renowned AI researcher contributing to advanced neural networks and ML ethics."
      />,
      <ImageCard
        key="2"
        imageSrc="/images/halloffame/rahul-verma.jpg"
        title="Mr. Rahul Verma"
        description="Founder of TechNova, a startup revolutionizing cloud infrastructure."
      />,
      <ImageCard
        key="3"
        imageSrc="/images/halloffame/sneha-gupta.jpg"
        title="Ms. Sneha Gupta"
        description="Award-winning cybersecurity expert working with Fortune 500 companies."
      />,
    ]}
    visibleCards={3}
  />
      </Section>

      {/* Achievements Section */}
      <Section id="achievements" title="Achievements">
        <div className="flex flex-col md:flex-row justify-center md:justify-between gap-8 max-w-4xl mx-auto">
          {/* Box 1 */}
          <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-md p-10 flex flex-col items-center text-center transition-transform hover:scale-[1.03] hover:shadow-lg duration-300">
            <div className="text-6xl font-extrabold text-orange-600 mb-4 tracking-tight">120+</div>
            <div className="uppercase text-sm font-semibold text-gray-500 tracking-widest mb-2">Papers Published</div>
            <p className="text-gray-600 max-w-xs">Published in reputed international journals, showcasing research excellence.</p>
          </div>

          {/* Box 2 */}
          <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-md p-10 flex flex-col items-center text-center transition-transform hover:scale-[1.03] hover:shadow-lg duration-300">
            <div className="text-6xl font-extrabold text-orange-600 mb-4 tracking-tight">350+</div>
            <div className="uppercase text-sm font-semibold text-gray-500 tracking-widest mb-2">Placed Students</div>
            <p className="text-gray-600 max-w-xs">Successfully placed in top-tier companies across diverse tech industries.</p>
          </div>

          {/* Box 3 */}
          <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-md p-10 flex flex-col items-center text-center transition-transform hover:scale-[1.03] hover:shadow-lg duration-300">
            <div className="text-6xl font-extrabold text-orange-600 mb-4 tracking-tight">15</div>
            <div className="text-sm font-semibold text-gray-500 tracking-widest mb-2">MoUs Signed</div>
            <p className="text-gray-600 max-w-xs">Strategic collaborations with leading organizations and institutions.</p>
          </div>
        </div>
      </Section>

      {/*Student Union Section */}
      <Section id="FIT" title="Faternity of Information Technology">
  <Carousel
    items={[
      <ImageCard
        key="1"
        imageSrc="/images/events/techsparks.jpg"
        title="Atharva Joshi"
        designation="President"
        description="Annual tech fest featuring coding competitions, robotics, and speaker sessions."
      />,
      <ImageCard
        key="2"
        imageSrc="/images/events/ai-workshop.jpg"
        title="Jigisha Meher"
        designation="Vice - President"
        description="Hands-on learning with industry experts in Artificial Intelligence and Robotics."
      />,
      <ImageCard
        key="3"
        imageSrc="/images/events/hackathon.jpg"
        title="Amey Jadhav"
        designation="Treasurer"
        description="Join year-round hackathons, webinars, and guest lectures on emerging tech."
      />,
    ]}
    visibleCards={3}
  />
      </Section>

      {/*Teachers Section */}
      <Section id="teachers" title="Teachers">
  <Carousel
    items={[
      <TeacherCard
        key="1"
        imageSrc="/images/ekta.png"
        title="Ekta Meshram"
        description="Annual tech fest featuring coding competitions, robotics, and speaker sessions."
      />,
      <TeacherCard
        key="2"
        imageSrc="/images/events/ai-workshop.jpg"
        title="AI & Robotics Workshop"
        description="Hands-on learning with industry experts in Artificial Intelligence and Robotics."
      />,
      <TeacherCard
        key="3"
        imageSrc="/images/events/hackathon.jpg"
        title="Hackathons & Seminars"
        description="Join year-round hackathons, webinars, and guest lectures on emerging tech."
      />,
        <TeacherCard
        key="3"
        imageSrc="/images/events/hackathon.jpg"
        title="Hackathons & Seminars"
        description="Join year-round hackathons, webinars, and guest lectures on emerging tech."
      />,
        <TeacherCard
        key="3"
        imageSrc="/images/events/hackathon.jpg"
        title="Hackathons & Seminars"
        description="Join year-round hackathons, webinars, and guest lectures on emerging tech."
      />,
        <TeacherCard
        key="3"
        imageSrc="/images/bharad.png"
        title="Hackathons & Seminars"
        description="Join year-round hackathons, webinars, and guest lectures on emerging tech."
      />,
        <TeacherCard
        key="3"
        imageSrc="/images/barphe.png"
        title="Hackathons & Seminars"
        description="Join year-round hackathons, webinars, and guest lectures on emerging tech."
      />,
    ]}
    
  />
      </Section>

      {/*Student Section */}
      <Section id="students" title="Find a Friend">
        <p>
          Student success stories and achievements are regularly updated. Visit our{' '}
          <Link href="/students" className="text-blue-600 underline hover:text-blue-800">Student Corner</Link>. To connect with peers
        </p>
      </Section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 text-sm py-6 px-6 mt-12 flex flex-col justify-center items-center">
        <div>
          © 2025 Department of Information Technology ·{' '}
          <Link href="/contact" className="underline hover:text-white">Contact Us</Link>
        </div>
      </footer>
    </div>
  )
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="py-8 px-6 max-w-6xl mx-auto text-left">
      <h2 className="text-2xl md:text-3xl font-bold text-orange-600 mb-4">{title}</h2>
      <div className="text-gray-700 text-base leading-relaxed">{children}</div>
    </section>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex-1 bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-xl font-semibold text-orange-600 mb-2">{title}</h3>
      <p className="text-gray-700">{children}</p>
    </div>
  )
}

function ImageCard({
  imageSrc,
  title,
  description,
}: {
  imageSrc: string
  title: string
  description: string
}) {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 w-full max-w-sm mx-auto">
      <Image
        src={imageSrc}
        alt={title}
        width={400}
        height={250}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-orange-600 mb-2">{title}</h3>
        <p className="text-gray-700 text-sm">{description}</p>
      </div>
    </div>
  )
}

function TeacherCard({
  imageSrc,
  title,
  description,
}: {
  imageSrc: string
  title: string
  description: string
}) {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 w-full max-w-sm mx-auto">
      <Image
        src={imageSrc}
        alt={title}
        width={400}
        height={250}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-orange-600 mb-2">{title}</h3>
        <p className="text-gray-700 text-sm">{description}</p>
      </div>
    </div>
  )
}

export function Carousel({
  items,
  visibleCards = 3,
}: {
  items: React.ReactNode[]
  visibleCards?: number
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [cardsToShow, setCardsToShow] = useState(visibleCards)
  const [manualMode, setManualMode] = useState(false)
  const autoSlideRef = useRef<NodeJS.Timeout | null>(null)

  // Responsive: Change number of visible cards
  useEffect(() => {
    const handleResize = () => {
      setCardsToShow(window.innerWidth < 768 ? 1 : visibleCards)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [visibleCards])

  // Auto-slide (disabled in manual mode)
  useEffect(() => {
    if (manualMode) return

    autoSlideRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length)
    }, 3000)

    return () => {
      if (autoSlideRef.current) clearInterval(autoSlideRef.current)
    }
  }, [manualMode, items.length])

  const handleNext = () => {
    setManualMode(true)
    setCurrentIndex((prev) => (prev + 1) % items.length)
  }

  const handlePrev = () => {
    setManualMode(true)
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
  }

  return (
    <div className="relative w-full overflow-hidden py-6">
      <div className="flex justify-between items-center mb-4 px-4">
        <button
          onClick={handlePrev}
          className="p-2 bg-orange-100 rounded-full hover:bg-orange-200 transition"
        >
          <ChevronLeftIcon className="h-5 w-5 text-orange-600" />
        </button>
        <button
          onClick={handleNext}
          className="p-2 bg-orange-100 rounded-full hover:bg-orange-200 transition"
        >
          <ChevronRightIcon className="h-5 w-5 text-orange-600" />
        </button>
      </div>

      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${(100 / cardsToShow) * currentIndex}%)`,
            width: `${(100 / cardsToShow) * items.length}%`,
          }}
        >
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 px-2"
              style={{ width: `${100 / items.length}%` }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

