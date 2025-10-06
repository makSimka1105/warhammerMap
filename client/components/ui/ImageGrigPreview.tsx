interface ImageGridPreviewProps {
  images: string[] | undefined | null;
}

export const ImageGridPreview: React.FC<ImageGridPreviewProps> = ({ images }) => {
  if (!images || images.length === 0) {
    return <div>Нет изображений</div>;
  }

  return (
    <div className={`grid gap-2 w-[100%] ${images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
      {images.map((src, idx) => (
        <img
          key={idx}
          src={`${process.env.NEXT_PUBLIC_ORIGIN_SERVER}/static/${src}.jpg`}
          alt={`Снимок ${idx + 1}`}
          className="w-full h-32 object-cover rounded"
        />
      ))}
    </div>

  );
};
