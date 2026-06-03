import Card from "../ui/Card";

export default function ArticleBody({ post }) {
  return (
    <article className="space-y-10">
      <div className="rounded-card overflow-hidden border border-[#E2EBF5]">
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-[260px] md:h-[420px] object-cover"
        />
      </div>

      <div className="bg-white rounded-card border border-[#E2EBF5] p-6 md:p-10">
        <p className="text-lg text-textmuted leading-8 mb-10">
          {post.excerpt}
        </p>

        {post.content.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="scroll-mt-28 mb-12"
          >
            <h2 className="font-playfair text-2xl md:text-3xl font-bold text-textprimary mb-5">
              {section.heading}
            </h2>

            <p className="text-textmuted leading-8 mb-6">
              {section.body}
            </p>

            {section.points?.length > 0 && (
              <ul className="space-y-3 mb-8">
                {section.points.map((point) => (
                  <li
                    key={point}
                    className="flex gap-3 text-textmuted"
                  >
                    <span className="mt-2 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            )}

            {section.callout && (
              <Card className="bg-primary/5 border-primary/15">
                <div className="flex flex-col gap-2">
                  <span className="text-primary text-xs font-semibold uppercase tracking-wide">
                    Key Takeaway
                  </span>

                  <p className="text-textprimary leading-7">
                    {section.callout}
                  </p>
                </div>
              </Card>
            )}
          </section>
        ))}
      </div>
    </article>
  );
}