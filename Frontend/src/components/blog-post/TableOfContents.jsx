import Card from "../ui/Card";

export default function TableOfContents({
  sections,
}) {
  if (!sections?.length) return null;

  return (
    <Card
      className="
        sticky
        top-24
        hidden
        xl:block
        max-h-[calc(100vh-7rem)]
        overflow-y-auto
        scrollbar-thin
      "
    >
      <h3 className="font-semibold text-textprimary mb-4">
        Table of Contents
      </h3>

      <nav>
        <ul className="space-y-3">
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="
                  block
                  text-sm
                  text-textmuted
                  hover:text-primary
                  transition-colors
                  leading-relaxed
                "
              >
                {section.heading}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </Card>
  );
}