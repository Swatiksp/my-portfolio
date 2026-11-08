function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] italic items-start leading-[normal] relative shrink-0">
      <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] font-['Playfair_Display:Italic',sans-serif] font-normal min-w-full relative shrink-0 text-[36px] w-[min-content]">Glad you’re here..</p>
      <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] font-['Playfair_Display:SemiBold_Italic',sans-serif] font-semibold relative shrink-0 text-[64px] whitespace-nowrap">I’m Swatik</p>
    </div>
  );
}

export default function Frame1() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[20px] items-start relative size-full text-black">
      <Frame />
      <p className="font-['Archivo:Regular',sans-serif] leading-[normal] min-w-full not-italic relative shrink-0 text-[16px] w-[min-content]">A UX designer crafting intuitive digital experiences that leverage emerging technologies, enhance usability, and create meaningful connections.</p>
      <div className="font-['Archivo:Regular',sans-serif] leading-[0] min-w-full not-italic relative shrink-0 text-[0px] w-[min-content]">
        <p className="font-['Archivo:Bold_Italic',sans-serif] italic leading-[normal] mb-0 text-[12px]">Previously at</p>
        <p className="leading-[normal] text-[16px]">Accenture</p>
      </div>
      <div className="font-['Archivo:Regular',sans-serif] leading-[0] min-w-full not-italic relative shrink-0 text-[0px] w-[min-content]">
        <p className="font-['Archivo:Bold_Italic',sans-serif] italic leading-[normal] mb-0 text-[12px]">Currently at</p>
        <p className="leading-[normal] text-[16px]">North Carolina State University #gowolfpack!</p>
      </div>
    </div>
  );
}