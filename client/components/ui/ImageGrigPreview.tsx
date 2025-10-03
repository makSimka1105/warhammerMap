interface ImageGridPreviewProps {
  images: string[] | undefined | null;
}

export const ImageGridPreview: React.FC<ImageGridPreviewProps> = ({ images }) => {
  if (!images || images.length === 0) {
    return <div>Нет изображений</div>;
  }

  return (
    <div className="grid grid-cols-2 gap-2 w-[90%]">
      {images.map((src, idx) => (
        <img
          key={idx}
          src={`${process.env.NEXT_PUBLIC_ORIGIN_SERVER}/static/`+src+".jpg"}
          alt={`Снимок ${idx + 1}`}
          className="w-full h-32 object-cover rounded"
        />
      ))}
    </div>
  );
};
