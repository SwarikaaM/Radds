import { useParams, Navigate } from "react-router-dom";

import { serviceDetails } from "../data/serviceDetails";

import ServiceHero from "../components/service-detail/ServiceHero";
import ServiceExplanation from "../components/service-detail/ServiceExplanation";
import ServiceSteps from "../components/service-detail/ServiceSteps";
import ServiceBenefits from "../components/service-detail/ServiceBenefits";
import ServiceAudience from "../components/service-detail/ServiceAudience";
import ServiceRisks from "../components/service-detail/ServiceRisks";
import ServiceFAQ from "../components/service-detail/ServiceFAQ";
import RelatedServices from "../components/service-detail/RelatedServices";
import ServiceCTA from "../components/service-detail/ServiceCTA";

export default function ServiceDetail() {
  const { slug } = useParams();

  const service = serviceDetails[slug];

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  return (
    <>
      <main >
        <ServiceHero service={service} />
        <ServiceExplanation service={service} />
        <ServiceSteps service={service} />
        <ServiceBenefits service={service} />
        <ServiceAudience service={service} />
        <ServiceRisks service={service} />
        <ServiceFAQ service={service} />
        <RelatedServices service={service} />
        <ServiceCTA />
      </main>
    </>
  );
}