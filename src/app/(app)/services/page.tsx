import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { servicesQuery } from "@/sanity/queries/servicesQuery";
import ServicePage, { type ServiceDoc } from "@/components/app/ServicesPage";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Services",
};

export default async function Page() {
  const services = await client.fetch<ServiceDoc[]>(servicesQuery);
  return <ServicePage services={services} />;
}
