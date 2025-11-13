import React, { useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

function ImageCarouselWithModal({ images }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentImg, setCurrentImg] = useState(null);

  const openModal = (img) => {
    setCurrentImg(img);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setCurrentImg(null);
  };

  if (!images || images.length === 0) return <p>No images uploaded yet.</p>;

  return (
    <div>
      <Carousel
        showThumbs={false}
        infiniteLoop={true}
        useKeyboardArrows={true}
        autoPlay={false}
        showIndicators={true}
        showStatus={false}
        dynamicHeight={true}
      >
        {images.map((img, idx) => (
          <div key={idx}>
            <img
              src={img}
              alt={`Product ${idx + 1}`}
              style={{ cursor: "pointer" }}
              onClick={() => openModal(img)}
            />
          </div>
        ))}
      </Carousel>

      {/* Modal */}
      {isOpen && (
        <div
          onClick={closeModal}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <img
            src={currentImg}
            alt="Zoomed"
            style={{ maxWidth: "90%", maxHeight: "90%", borderRadius: "10px" }}
          />
        </div>
      )}
    </div>
  );
}

export default ImageCarouselWithModal;
