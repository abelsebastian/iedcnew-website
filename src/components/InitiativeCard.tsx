import { Link } from "react-router-dom";
import type { Initiative } from "../data/initiatives";
import { ArrowOutIcon } from "./icons";

type Props = { item: Initiative };

export default function InitiativeCard({ item }: Props) {
  const isExternal = item.external || /^https?:\/\//.test(item.href);
  const cardLink = item.href || "#";

  const Wrapper = ({ children, className, ...rest }: any) =>
    isExternal ? (
      <a
        href={cardLink}
        target="_blank"
        rel="noreferrer"
        className={className}
        {...rest}
      >
        {children}
      </a>
    ) : (
      <Link to={cardLink} className={className} {...rest}>
        {children}
      </Link>
    );

  return (
    <article className="group bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition duration-300 flex flex-col">
      <Wrapper className="contents">
        <div className="p-4 flex justify-between items-center bg-white relative z-10">
          <div className="min-w-0">
            <h4 className="font-bold text-lg leading-tight truncate">
              {item.title}
            </h4>
          </div>
          <div className="bg-black text-white p-1.5 rounded-md shrink-0">
            <ArrowOutIcon className="w-4 h-4" />
          </div>
        </div>

        <div className="relative pb-[100%]">
          <img
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            src={item.image}
            loading="lazy"
            decoding="async"
          />
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/85 via-black/60 to-transparent text-white">
            <p className="font-semibold text-sm leading-tight whitespace-pre-line">
              {item.subtitle}
            </p>
            <div className="flex justify-between items-center mt-3 gap-2">
              <p className="text-xs opacity-80 truncate">
                {item.cta ?? "Learn More"}
              </p>
              <span
                aria-hidden="true"
                className="bg-black text-white p-1.5 rounded-lg shrink-0"
              >
                <ArrowOutIcon className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      </Wrapper>
    </article>
  );
}
