import "@/components/homeSlider/homeSlider.css";

export default function HomeSlider() {
  return (
    <div className="h-64">
      <section className="relative bg-gray-200 h-64 flex items-center justify-center text-lg font-semibold">
        <button className="absolute left-4 text-2xl">&larr;</button>
        <div>Rotating Hero</div>
        <button className="absolute right-4 text-2xl">&rarr;</button>
      </section>
    </div>
  );
}
