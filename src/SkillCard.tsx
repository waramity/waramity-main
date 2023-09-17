import React, { useState, useEffect, CSSProperties } from "react";
import ReactDOM from "react-dom";

import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

import Select, { StylesConfig } from "react-select";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import "./SkillCard.scss";

const CARDS: number = 10;
const MAX_VISIBILITY: number = 3;

interface CardProps {
  title: string;
  image: string;
}

const Card: React.FC<CardProps> = ({ title, image }) => (
  <div className="skill-card row p-5">
    <div className="col-12 text-center pt-3 mt-2 mb-1">
      <img src={image} alt={title} className="image-card" />
    </div>
    <div className="col-12">
      <h3 className="text-white fw-light text-center">{title}</h3>
    </div>
  </div>
);

interface CarouselProps {
  children: React.ReactNode;
  active: number;
  setActive: React.Dispatch<React.SetStateAction<number>>;
}

const Carousel: React.FC<CarouselProps> = ({ children, active, setActive }) => {
  const count: number = React.Children.count(children);

  return (
    <div className="carousel">
      {active > 0 && (
        <button
          className="skill-card-nav left"
          onClick={() => setActive((i) => i - 1)}
        >
          <FaAngleLeft />
        </button>
      )}
      {React.Children.map(children, (child: React.ReactElement, i: number) => (
        <div
          className="card-container"
          style={
            {
              "--active": i === active ? 1 : 0,
              "--offset": (active - i) / 3,
              "--direction": Math.sign(active - i),
              "--abs-offset": Math.abs(active - i) / 3,
              "--pointer-events": active === i ? "auto" : "none",
              opacity: Math.abs(active - i) >= MAX_VISIBILITY ? "0" : "1",
              display: Math.abs(active - i) > MAX_VISIBILITY ? "none" : "block",
            } as CSSProperties
          }
        >
          {child}
        </div>
      ))}
      {active < count - 1 && (
        <button
          className="skill-card-nav right"
          onClick={() => setActive((i) => i + 1)}
        >
          <FaAngleRight />
        </button>
      )}
    </div>
  );
};

interface CardData {
  images: string[];
  labels: string[];
  title: string;
}

interface CurrentCard {
  images: string[];
  labels: string[];
}

interface MobileOption {
  value: string;
  label: string;
  images: string[];
  labels: string[];
}

const mobileOptionStyles: StylesConfig<MobileOption> = {
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      color: isDisabled ? "#ccc" : isSelected ? "white" : "black",
      backgroundColor: isDisabled
        ? undefined
        : isSelected
        ? "black"
        : isFocused
        ? "white"
        : undefined,
      ":active": {
        ...styles[":active"],
        backgroundColor: !isDisabled
          ? isSelected
            ? "black"
            : "white"
          : undefined,
      },
    };
    //   return {
    //     ...styles,
    //     backgroundColor: isDisabled
    //       ? undefined
    //       : isSelected
    //       ? data.color
    //       : isFocused
    //       ? color.alpha(0.1).css()
    //       : undefined,
    //     color: isDisabled
    //       ? "#ccc"
    //       : isSelected
    //       ? chroma.contrast(color, "white") > 2
    //         ? "white"
    //         : "black"
    //       : data.color,
    //     cursor: isDisabled ? "not-allowed" : "default",
    //
    //     ":active": {
    //       ...styles[":active"],
    //       backgroundColor: !isDisabled
    //         ? isSelected
    //           ? data.color
    //           : color.alpha(0.3).css()
    //         : undefined,
    //     },
    //   };
  },
  // input: (styles) => ({ ...styles, ...dot() }),
  // placeholder: (styles) => ({ ...styles, ...dot("#ccc") }),
  // singleValue: (styles, { data }) => ({ ...styles, ...dot(data.color) }),
};

const SkillCard: React.FC = () => {
  const [cardsData, setCardsData] = useState<CardData[]>();
  const [currentCard, setCurrentCard] = useState<CurrentCard>();
  const [active, setActive] = useState<number>(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

  const [mobileOption, setMobileOption] = useState<MobileOption[]>();
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    fetch("/en/get_skill_nav")
      .then((response) => response.json())
      .then((data) => {
        setCardsData(data);
        setCurrentCard({ labels: data[0].labels, images: data[0].images });
        generateMobileOption(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleCardChange = (card: CurrentCard, index: number) => {
    setCurrentCard(card);
    setActive(0);
    setActiveIndex(index);
  };

  const handleResize = () => {
    setViewportWidth(window.innerWidth);
  };

  const generateMobileOption = (data: CardData[]) => {
    const mobileOption = data.map((item, i) => ({
      value: item.title,
      label: item.title,
      images: item.images,
      labels: item.labels,
    }));

    setMobileOption(mobileOption);
  };

  const handleSelectChange = (value: any) => {
    console.log(value);
  };

  if (viewportWidth < 768) {
    return (
      <div>
        {mobileOption ? (
          <Select
            defaultValue={mobileOption[0]}
            options={mobileOption}
            styles={mobileOptionStyles}
            onChange={handleSelectChange}
            className="mx-2 z-3"
          />
        ) : (
          <p>Loading data...</p>
        )}

        <Swiper
          spaceBetween={50}
          slidesPerView={3}
          onSlideChange={() => console.log("slide change")}
          onSwiper={(swiper) => console.log(swiper)}
        >
          {currentCard ? (
            currentCard.labels.map((label: string, i: number) => (
              <SwiperSlide key={i}>
                {"/static/data/main/" + currentCard.images[i]} {label}
              </SwiperSlide>
            ))
          ) : (
            <p>Loading data...</p>
          )}
        </Swiper>
      </div>
    );
  } else {
    return (
      <div className="row">
        <div className="col-12 col-md-6">
          <ul className="nav nav-underline mb-3 flex-column">
            {cardsData ? (
              cardsData.map((item: CardData, i: number) => (
                <li className="nav-item skill-topic" role="presentation">
                  <button
                    onClick={() =>
                      handleCardChange(
                        {
                          labels: item.labels,
                          images: item.images,
                        },
                        i
                      )
                    }
                    className={`nav-link text-secondary skill-btn ${
                      i === activeIndex ? "active" : ""
                    }`}
                  >
                    {item.title}
                  </button>
                </li>
              ))
            ) : (
              <p>Loading data...</p>
            )}
          </ul>
        </div>
        <div className="col-12 col-md-6 mt-5">
          <Carousel active={active} setActive={setActive}>
            {currentCard ? (
              currentCard.labels.map((label: string, i: number) => (
                <Card
                  key={i}
                  title={label}
                  image={"/static/data/main/" + currentCard.images[i]}
                />
              ))
            ) : (
              <p>Loading data...</p>
            )}
          </Carousel>
        </div>
      </div>
    );
  }
};

export default SkillCard;
