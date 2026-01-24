function ContactCard({ icon, title, description, content, link, linkText }) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4 flex items-center justify-center">
        <div className="rounded-full bg-pink-100 p-4">{icon}</div>
      </div>
      <h3 className="mb-2 text-center text-xl font-bold text-stone-800">
        {title}
      </h3>
      {description && (
        <p className="mb-2 text-center text-stone-600">{description}</p>
      )}
      {content && (
        <div className="text-center text-stone-600">{content}</div>
      )}
      {link && linkText && (
        <a
          href={link}
          className="block text-center text-pink-600 hover:text-pink-700 hover:underline"
        >
          {linkText}
        </a>
      )}
    </div>
  );
}

export default ContactCard;
