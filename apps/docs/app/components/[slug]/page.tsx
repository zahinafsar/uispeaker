import { notFound } from "next/navigation";
import { COMPONENTS, getComponentBySlug, getAllSlugs } from "../component-data";
import { ComponentShowcase } from "./component-showcase";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const component = getComponentBySlug(slug);
  if (!component) return {};

  return {
    title: `${component.name} - UISpeaker Components`,
    description: component.description,
  };
}

export default async function ComponentPage({ params }: PageProps) {
  const { slug } = await params;
  const component = getComponentBySlug(slug);

  if (!component) {
    notFound();
  }

  // Find prev/next for navigation
  const index = COMPONENTS.findIndex((c) => c.slug === slug);
  const prev = index > 0 ? COMPONENTS[index - 1] : null;
  const next = index < COMPONENTS.length - 1 ? COMPONENTS[index + 1] : null;

  return (
    <ComponentShowcase
      component={component}
      prev={prev}
      next={next}
    />
  );
}
