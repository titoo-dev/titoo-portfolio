export const BackgroundPattern = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute left-0 right-0 top-0 m-auto h-[310px] w-[310px] rounded-full bg-primary opacity-20 blur-[100px]" />
      <div className="absolute -right-24 top-1/3 h-[200px] w-[200px] rounded-full bg-blue-500 opacity-10 blur-[100px]" />
      <div className="absolute -left-24 bottom-1/4 h-[200px] w-[200px] rounded-full bg-purple-500 opacity-10 blur-[100px]" />
    </div>
  );
};
