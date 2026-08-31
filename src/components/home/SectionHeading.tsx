interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "default" | "inverted";
}

export const SectionHeading = ({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "default",
}: SectionHeadingProps) => {
  const inverted = tone === "inverted";
  return (
    <div
      className={
        (align === "center" ? "mx-auto text-center " : "") +
        "mb-10 max-w-2xl sm:mb-12"
      }
    >
      {eyebrow ? (
        <p
          className={
            "type-eyebrow mb-3 " + (inverted ? "text-secondary-foreground/60" : "")
          }
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={
          "type-h1 " + (inverted ? "text-secondary-foreground" : "text-foreground")
        }
      >
        {title}
      </h2>
      {description ? (
        <p
          className={
            "mt-4 text-base leading-relaxed " +
            (inverted ? "text-secondary-foreground/70" : "text-muted-foreground")
          }
        >
          {description}
        </p>
      ) : null}
      <div className={"rule-gold mt-5" + (align === "center" ? " mx-auto" : "")} />
    </div>
  );
};
