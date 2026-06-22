import { Container } from "@/components/ui/Container";

/** A 1px hairline divider between sections (spec §4 — no heavy boxes). */
export function SectionDivider() {
  return (
    <Container>
      <hr className="border-0 border-t border-hairline" />
    </Container>
  );
}
