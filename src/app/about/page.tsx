import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const teamMembers = [
  {
    name: "Benjamin He",
    role: "Full-stack, AI engineer, Project Manager",
    image: "/team/placeholder.jpg",
    description:
      "Bio - to be filled",
  },
  {
    name: "Daniel Wang",
    role: "Full-stack, AI engineer",
    image: "/team/placeholder.jpg",
    description:
      "Bio - to be filled",
  },
  {
    name: "Viola Qiu",
    role: "AI engineer, UI/UX designer",
    image: "/team/placeholder.jpg",
    description:
      "Bio - to be filled",
  },
  {
    name: "Jiayi Ding",
    role: "AI engineer, EDA Analysis",
    image: "/team/placeholder.jpg",
    description:
      "Bio - to be filled",
  },
  {
    name: "Umesh Kant",
    role: "AWS, Infra SME engineer",
    image: "/team/placeholder.jpg",
    description:
      "Bio - to be filled",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Top-left cell: Header & subheader */}
          <div className="flex flex-col justify-center">
            <h1
              className="font-serif text-fg-primary tracking-display leading-[1.05]"
              style={{ fontSize: "clamp(4rem, 3rem + 4vw, 7rem)" }}
            >
              Meet the Team
            </h1>
            <p className="mt-4 text-body-lg text-fg-secondary max-w-prose">
              The people behind LifeLedger, dedicated to helping you organize
              and track your personal documents and expenses.
            </p>
          </div>

          {/* 5 team member cards filling the remaining cells */}
          {teamMembers.map((member, index) => (
            <article
              key={index}
              className="rounded-2xl bg-bg-secondary p-6 border border-bg-tertiary/50 hover:border-bg-tertiary transition-colors duration-200"
            >
              <div className="aspect-square w-full rounded-xl overflow-hidden bg-bg-tertiary">
                <div className="w-full h-full flex items-center justify-center text-fg-tertiary text-sm">
                  Photo
                </div>
              </div>
              <h2 className="mt-4 text-display font-sans font-semibold text-fg-primary tracking-heading">
                {member.name}
              </h2>
              <p className="mt-1 text-sm font-medium text-accent tracking-wide">
                {member.role}
              </p>
              <p className="mt-3 text-base text-fg-secondary leading-relaxed">
                {member.description}
              </p>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
