import { Building2, PartyPopper, Soup, Truck } from "lucide-react";
import { BookingForm } from "@/components/ui/booking-form";

const serviceCards = [
  {
    icon: PartyPopper,
    title: "Private Events",
    text: "Birthdays, naming ceremonies, family gatherings and celebrations with food that feels personal.",
  },
  {
    icon: Building2,
    title: "Corporate Catering",
    text: "Office lunches, meetings and team events with reliable service and generous Nigerian flavour.",
  },
  {
    icon: Soup,
    title: "Party Trays",
    text: "Coolers, trays, soups, rice dishes, proteins and sides planned around your guest count.",
  },
  {
    icon: Truck,
    title: "Delivery Support",
    text: "We help coordinate timing and practical details so your food arrives ready for the moment.",
  },
];

export default function ReservationPage() {
  return (
    <main className="reservation-page">
      <section className="page-banner d-flex align-items-center">
        <div className="container">
          <div className="row">
            <div className="banner-content">
              <h2
                className="text-white display-3 text-center"
                data-aos="fade-right"
                data-aos-delay="0"
              >
                Booking
              </h2>
              <div className="divider" data-aos="fade-up-right" data-aos-delay="0">
                <div className="dot mb-2"></div>
              </div>
              <p
                className="text-white mb-0 text-center"
                data-aos="fade-left"
                data-aos-delay="0"
              >
                Book Chop Republic for private events, party trays, corporate
                catering and special gatherings.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container py-4">
          <div className="mx-auto mb-4 max-w-3xl text-center">
            <h2 className="display-6 fw-bold text-[#07091d]" data-aos="fade-right">
              Catering & Event Booking
            </h2>
            <div
              data-aos="fade-right"
              className="reservation-line d-flex justify-content-center align-items-center"
            >
              <span></span>
            </div>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[#3a4658]">
              Share a few details about your event and our team will come back
              to you with availability, menu guidance and the next steps.
            </p>
          </div>

          <div className="relative">
            <img
              className="pointer-events-none absolute -right-2 -top-12 z-10 hidden w-44 lg:block"
              src="/assets/images/reservation-showcase.png"
              alt=""
            />
            <BookingForm />
          </div>
        </div>
      </section>

      <section className="reservation-services py-5">
        <div className="container py-5">
          <div className="row">
            <h2
              data-aos="fade-right"
              className="position-relative text-center display-6 text-white fw-bold"
            >
              Booking Services
            </h2>
            <div
              data-aos="fade-right"
              className="reservation-line d-flex justify-content-center align-items-center"
            >
              <span></span>
            </div>
          </div>
          <div className="row gy-4">
            {serviceCards.map((service, index) => {
              const Icon = service.icon;

              return (
                <div
                  className="position-relative col-sm-12 col-md-6 col-lg-3 d-flex justify-content-center align-items-center flex-column"
                  data-aos="fade-up"
                  data-aos-delay={index * 80}
                  key={service.title}
                >
                  <div className="icon-box">
                    <Icon size={32} />
                    <span className="number">{index + 1}</span>
                  </div>
                  <h4>{service.title}</h4>
                  <p className="text-center">{service.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
