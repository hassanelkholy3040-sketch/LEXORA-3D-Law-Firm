import { useState } from 'react';
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading.jsx';

const initialValues = { name: '', email: '', phone: '', subject: '', message: '' };

function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = 'Please enter your full name.';
  if (!values.email.trim()) errors.email = 'Please enter your email address.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Enter a valid email address.';
  if (values.phone.trim()) {
    const digits = values.phone.replace(/\D/g, '').length;
    if (!/^[+\d(][\d\s().-]*$/.test(values.phone) || digits < 7 || digits > 15) {
      errors.phone = 'Enter a valid phone number or leave this field blank.';
    }
  }
  if (!values.subject.trim()) errors.subject = 'Please add a subject.';
  if (!values.message.trim()) errors.message = 'Please tell us a little about your matter.';
  return errors;
}

export default function Contact() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const updateField = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
    setSubmitted(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setSubmitted(false);
      document.getElementById(Object.keys(nextErrors)[0])?.focus();
      return;
    }
    setSubmitted(true);
    setValues(initialValues);
  };

  const fieldProps = (name, label, options = {}) => ({
    id: name,
    name,
    value: values[name],
    onChange: updateField,
    required: options.required,
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
    placeholder: options.placeholder ?? ' ',
    type: options.type ?? 'text',
    autoComplete: options.autoComplete,
    label,
  });

  return (
    <section className="section contact" id="contact" aria-labelledby="contact-title">
      <div className="container contact__layout">
        <div className="contact__content">
          <SectionHeading eyebrow="Start a conversation" title={<>Let’s Discuss Your<br /><em>Legal Needs</em></>} description="Tell us what brings you here. Our team will help you understand the next step." id="contact-title" />
          <div className="contact-details" data-reveal>
            <a className="contact-detail" href="mailto:contact@example.com"><span><Mail size={17} /></span><span><small>Email</small>contact@example.com</span><ArrowUpRight size={15} /></a>
            <a className="contact-detail" href="tel:+10000000000"><span><Phone size={17} /></span><span><small>Phone</small>+1 000 000 0000</span><ArrowUpRight size={15} /></a>
            <div className="contact-detail"><span><MapPin size={17} /></span><span><small>Office</small>Office address placeholder<br />New York, NY 00000</span></div>
          </div>
          <p className="contact__note">The contact details shown are placeholders for this demonstration.</p>
        </div>

        <form className="contact-form" onSubmit={handleSubmit} noValidate data-reveal>
          <div className="contact-form__heading"><span>01 / GET IN TOUCH</span><span className="contact-form__required">* Required fields</span></div>
          <div className="form-row">
            <FormField {...fieldProps('name', 'Full name', { required: true, autoComplete: 'name' })} error={errors.name} />
            <FormField {...fieldProps('email', 'Email address', { type: 'email', required: true, autoComplete: 'email' })} error={errors.email} />
          </div>
          <div className="form-row">
            <FormField {...fieldProps('phone', 'Phone number', { type: 'tel', autoComplete: 'tel' })} error={errors.phone} />
            <FormField {...fieldProps('subject', 'Subject', { required: true })} error={errors.subject} />
          </div>
          <FormField {...fieldProps('message', 'How can we help?', { required: true })} error={errors.message} textarea />
          <button className="button button--primary contact-form__submit" type="submit">Send an inquiry <ArrowUpRight size={15} aria-hidden="true" /></button>
          <p className="contact-form__demo">Frontend demonstration only. This form does not send or store messages.</p>
          <div className="form-feedback" aria-live="polite" role={submitted ? 'status' : undefined}>
            {submitted && <p className="form-feedback__success">Thank you. Your demo inquiry has been validated locally and was not sent.</p>}
            {!submitted && Object.keys(errors).length > 0 && <p className="form-feedback__error">Please review the highlighted fields.</p>}
          </div>
        </form>
      </div>
    </section>
  );
}

function FormField({ id, name, value, onChange, label, error, textarea = false, type, ...props }) {
  const Field = textarea ? 'textarea' : 'input';
  return (
    <div className={`form-field${error ? ' form-field--error' : ''}${value ? ' form-field--filled' : ''}`}>
      <Field {...props} {...(!textarea && type ? { type } : {})} id={id} name={name} value={value} onChange={onChange} />
      <label htmlFor={id}>{label}{props.required && <span aria-hidden="true"> *</span>}</label>
      {error && <span className="form-field__error" id={`${id}-error`}>{error}</span>}
    </div>
  );
}
