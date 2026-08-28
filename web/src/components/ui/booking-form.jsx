import { useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Loader2,
  Mail,
  MessageSquareText,
  Phone,
  User,
  Users2,
  UtensilsCrossed,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const services = [
  "Private event catering",
  "Corporate catering",
  "Birthday party",
  "Wedding catering",
  "Funeral or memorial catering",
  "Bulk food order",
  "Custom enquiry",
];

const guestRanges = [
  "10 - 25 guests",
  "26 - 50 guests",
  "51 - 100 guests",
  "101 - 200 guests",
  "200+ guests",
  "Not sure yet",
];

const dropdownVariants = {
  open: {
    opacity: 1,
    scaleY: 1,
    transition: {
      duration: 0.18,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.05,
      when: "beforeChildren",
    },
  },
  closed: {
    opacity: 0,
    scaleY: 0,
    transition: {
      duration: 0.14,
      ease: [0.4, 0, 1, 1],
      staggerChildren: 0.035,
      staggerDirection: -1,
      when: "afterChildren",
    },
  },
};

const dropdownItemVariants = {
  open: { opacity: 1, y: 0 },
  closed: { opacity: 0, y: -8 },
};

const dropdownIconVariants = {
  open: { rotate: 180 },
  closed: { rotate: 0 },
};

const initialForm = {
  name: "",
  phone: "",
  email: "",
  service: services[0],
  guests: guestRanges[1],
  date: "",
  message: "",
};

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:4242";

function Field({ icon: Icon, children, className }) {
  return (
    <div
      className={cn(
        "flex min-h-12 items-center rounded-[8px] border border-[#dfe3ea] bg-white shadow-sm transition focus-within:border-[#b00012] focus-within:ring-2 focus-within:ring-[#b00012]/10",
        className,
      )}
    >
      <span className="flex h-full min-h-12 w-12 items-center justify-center border-r border-[#eef0f3] text-[#8a94a6]">
        <Icon size={18} />
      </span>
      {children}
    </div>
  );
}

function BookingDropdown({ icon: Icon, label, name, onChange, options, value }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const closeOnOutsideClick = (event) => {
      if (!dropdownRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div ref={dropdownRef} className="relative">
      <input name={name} readOnly required type="hidden" value={value} />
      <motion.div animate={open ? "open" : "closed"} className="relative">
        <button
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-label={label}
          className="booking-dropdown-trigger"
          onClick={() => setOpen((current) => !current)}
          type="button"
        >
          <span className="booking-dropdown-icon">
            <Icon size={18} />
          </span>
          <span className="booking-dropdown-value">{value}</span>
          <motion.span
            aria-hidden="true"
            className="booking-dropdown-chevron"
            variants={dropdownIconVariants}
          >
            <i className="fa fa-chevron-down text-[11px]"></i>
          </motion.span>
        </button>

        <AnimatePresence>
          {open ? (
            <motion.ul
              className="booking-dropdown-menu"
              exit="closed"
              initial="closed"
              role="listbox"
              style={{ originY: "top" }}
              variants={dropdownVariants}
            >
              {options.map((option) => {
                const selected = option === value;

                return (
                  <motion.li key={option} variants={dropdownItemVariants}>
                    <button
                      aria-selected={selected}
                      className={cn(
                        "booking-dropdown-option",
                        selected && "is-selected",
                      )}
                      onClick={() => {
                        onChange(name, option);
                        setOpen(false);
                      }}
                      role="option"
                      type="button"
                    >
                      {option}
                    </button>
                  </motion.li>
                );
              })}
            </motion.ul>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export function BookingForm({ className }) {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");
  const [feedback, setFeedback] = useState("");

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const updateDropdown = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("loading");
    setFeedback("");

    try {
      const response = await fetch(`${apiBaseUrl}/api/booking-enquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Unable to send booking enquiry.");
      }

      setStatus("success");
      setFeedback(
        data.emailed
          ? "Thanks. Your booking enquiry has been sent. We will contact you to validate details and confirm availability."
          : "Thanks. Your booking enquiry has been saved. Email is not configured yet, so the team should check the backend enquiry file.",
      );
      setForm(initialForm);
    } catch {
      setStatus("error");
      setFeedback("We could not send your booking enquiry right now. Please try again or call us directly.");
    }
  };

  return (
    <motion.div
      className={cn(
        "mx-auto w-full max-w-5xl rounded-[8px] border border-[#d7dbe3] bg-white p-6 shadow-[0_24px_70px_rgba(17,24,39,0.08)] md:p-10",
        className,
      )}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-8 text-center">
          <p className="mx-auto max-w-2xl text-sm leading-7 text-[#3a4658]">
            Tell us what you are planning and we will contact you to confirm
            availability, menu options and pricing. You can also call us directly
            on <a className="font-bold text-[#b00012]" href="tel:+447990532631">+44 7990 532631</a>.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field icon={User}>
            <input
              className="h-12 w-full border-0 bg-transparent px-4 text-sm text-[#111827] outline-none placeholder:text-[#7c8798]"
              name="name"
              onChange={updateField}
              placeholder="Full name"
              required
              type="text"
              value={form.name}
            />
          </Field>

          <Field icon={Mail}>
            <input
              className="h-12 w-full border-0 bg-transparent px-4 text-sm text-[#111827] outline-none placeholder:text-[#7c8798]"
              name="email"
              onChange={updateField}
              placeholder="Email address"
              required
              type="email"
              value={form.email}
            />
          </Field>

          <Field icon={Phone}>
            <input
              className="h-12 w-full border-0 bg-transparent px-4 text-sm text-[#111827] outline-none placeholder:text-[#7c8798]"
              name="phone"
              onChange={updateField}
              placeholder="Phone / WhatsApp number"
              required
              type="tel"
              value={form.phone}
            />
          </Field>

          <BookingDropdown
            icon={UtensilsCrossed}
            label="Choose booking service"
            name="service"
            onChange={updateDropdown}
            options={services}
            value={form.service}
          />

          <Field icon={CalendarDays}>
            <input
              className="h-12 w-full border-0 bg-transparent px-4 text-sm text-[#111827] outline-none"
              name="date"
              onChange={updateField}
              required
              type="date"
              value={form.date}
            />
          </Field>

          <BookingDropdown
            icon={Users2}
            label="Choose guest range"
            name="guests"
            onChange={updateDropdown}
            options={guestRanges}
            value={form.guests}
          />

          <Field icon={MessageSquareText} className="items-start md:col-span-2">
            <textarea
              className="min-h-28 w-full resize-y border-0 bg-transparent px-4 py-3 text-sm text-[#111827] outline-none placeholder:text-[#7c8798]"
              name="message"
              onChange={updateField}
              placeholder="Tell us the location, menu ideas, budget, timing, or anything important."
              value={form.message}
            />
          </Field>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4">
          <Button className="min-w-48" disabled={status === "loading"} size="lg" type="submit">
            {status === "loading" ? (
              <Loader2 className="animate-spin" />
            ) : status === "success" ? (
              <CheckCircle2 />
            ) : null}
            {status === "loading" ? "Sending Enquiry" : "Send Booking Enquiry"}
          </Button>

          {feedback ? (
            <motion.p
              className={cn(
                "m-0 max-w-xl text-center text-sm",
                status === "error" ? "text-[#a8000d]" : "text-[#3a695d]",
              )}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {feedback}
            </motion.p>
          ) : null}
        </div>
      </form>
    </motion.div>
  );
}
