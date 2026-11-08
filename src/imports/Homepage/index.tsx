function Frame() {
  return (
    <div className="content-stretch flex flex-col font-['Archivo:SemiBold',sans-serif] gap-[12px] items-start leading-[normal] relative shrink-0 text-[40px]">
      <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] min-w-full relative shrink-0 w-[min-content]">HELLO!</p>
      <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] relative shrink-0 whitespace-nowrap">I’M SWATIK</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="[word-break:break-word] absolute content-stretch flex flex-col gap-[20px] items-start left-[80px] not-italic text-black top-[192px] w-[518px]">
      <Frame />
      <p className="font-['Archivo:Regular',sans-serif] leading-[normal] min-w-full relative shrink-0 text-[16px] w-[min-content]">A UX designer crafting intuitive digital experiences that leverage emerging technologies, enhance usability, and create meaningful connections.</p>
      <div className="font-['Archivo:Regular',sans-serif] leading-[0] min-w-full relative shrink-0 text-[0px] w-[min-content]">
        <p className="font-['Archivo:Bold_Italic',sans-serif] italic leading-[normal] mb-0 text-[12px]">Previously at</p>
        <p className="leading-[normal] text-[16px]">Accenture</p>
      </div>
      <div className="font-['Archivo:Regular',sans-serif] leading-[0] min-w-full relative shrink-0 text-[0px] w-[min-content]">
        <p className="font-['Archivo:Bold_Italic',sans-serif] italic leading-[normal] mb-0 text-[12px]">Currently at</p>
        <p className="leading-[normal] text-[16px]">North Carolina State University #gowolfpack!</p>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="[word-break:break-word] content-stretch flex font-['Archivo:Regular',sans-serif] gap-[60px] items-center leading-[normal] not-italic relative shrink-0 text-[16px] text-black whitespace-nowrap">
      <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] relative shrink-0">TO START OFF...</p>
      <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] relative shrink-0">MY CRAFT</p>
      <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] relative shrink-0">WHO AM I?</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="absolute bg-[#d9d9d9] content-stretch flex gap-[854px] h-[66px] items-center left-0 px-[80px] py-[25px] top-0">
      <div aria-hidden className="absolute border-[#c4c4c4] border-b-[0.4px] border-solid inset-0 pointer-events-none" />
      <div className="bg-black relative rounded-[2px] shrink-0 size-[16px]" />
      <Frame1 />
    </div>
  );
}

export default function Homepage() {
  return (
    <div className="bg-white relative size-full" data-name="Homepage">
      <div className="absolute bg-[#d9d9d9] border-[#c4c4c4] border-[0.4px] border-solid h-[117px] left-[1268px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] top-[162px] w-[191px]" />
      <div className="absolute bg-[#d9d9d9] border-[#c4c4c4] border-[0.4px] border-solid h-[146px] left-[1130px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] top-[248px] w-[242px]" />
      <div className="absolute bg-[#d9d9d9] border-[#c4c4c4] border-[0.4px] border-solid h-[185px] left-[968px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] top-[361px] w-[305px]" />
      <div className="absolute bg-[#d9d9d9] border-[#c4c4c4] border-[0.4px] border-solid h-[239px] left-[748px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] top-[494px] w-[396px]" />
      <div className="absolute bg-[#d9d9d9] border-[#c4c4c4] border-[0.4px] border-solid h-[321px] left-[398px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] top-[594px] w-[531px]" />
      <div className="absolute bg-[#d9d9d9] border-[#c4c4c4] border-[0.4px] border-solid h-[347px] left-[-19px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] top-[707px] w-[571px]" />
      <Frame3 />
      <Frame2 />
    </div>
  );
}