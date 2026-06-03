import { MapPinned } from "lucide-react";

export default function MapPlaceholder() {


  return (
    <section className="py-24 bg-white">
        <div className=" rounded-t-2xl w-[90%] m-auto border border-[#E2EBF5] bg-[#F4F8FC] flex flex-col items-center justify-center">
          <p className="text-xl font-semibold mb-2 mt-1"> 
            Office Location           
          </p>
          </div>
        <div className="map-responsive">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.645792335604!2d73.01095147466528!3d19.079304951869897!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c1e7288dab67%3A0xe76295651baec93!2sRadds%20Capital!5e0!3m2!1sen!2sin!4v1780401766389!5m2!1sen!2sin" 
                width="1200" 
                height="250" 
                allowFullScreen="" loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Radds Capital Location"
            ></iframe>
        </div>
      {/* <div className="max-w-7xl mx-auto px-6">
        <div className="h-[450px] rounded-2xl border border-[#E2EBF5] bg-[#F4F8FC] flex flex-col items-center justify-center">
           <MapPinned
            size={40}
            className="text-primary mb-4"
          />

          <h3 className="text-xl font-semibold mb-2">
            Office Location
          </h3>

          <p className="text-[#6B7E99]">
            Interactive map placeholder
          </p> 
        </div>
      </div> */}
    </section>
  );
}