function Card() {
  return <div className="bg-[#d9d9d9] border-[#c4c4c4] border-[0.5px] border-solid h-[467px] relative w-[630px]" data-name="Card" />;
}

function Container1() {
  return <div className="bg-[#9b9999] h-[293.578px] relative shrink-0 w-[629.281px]" data-name="Container" />;
}

function Text() {
  return (
    <div className="relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Archivo:Bold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[20px] text-black whitespace-nowrap">Project Four</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-end relative size-full">
        <Text />
      </div>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Archivo:Regular',sans-serif] leading-[19.25px] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">A placeholder description for the fourth project in the portfolio collection.</p>
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="absolute bg-[#f2f2f2] content-stretch flex flex-col h-[31px] items-start left-0 px-[10px] py-[5px] rounded-[2px] top-0" data-name="Text">
      <p className="[word-break:break-word] font-['Archivo:Regular',sans-serif] leading-[21px] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">Dashboard</p>
    </div>
  );
}

function Text2() {
  return (
    <div className="absolute bg-[#f2f2f2] content-stretch flex flex-col h-[31px] items-start left-[96.89px] px-[10px] py-[5px] rounded-[2px] top-0" data-name="Text">
      <p className="[word-break:break-word] font-['Archivo:Regular',sans-serif] leading-[21px] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">Data Viz</p>
    </div>
  );
}

function Container4() {
  return (
    <div className="h-[31px] relative shrink-0 w-[589.281px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text1 />
        <Text2 />
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="flex-[172.422_0_0] min-h-px relative" data-name="Container">
      <div className="flex flex-col justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[10px] items-start justify-center px-[20px] py-[14px] relative size-full">
          <Container3 />
          <Paragraph />
          <Container4 />
        </div>
      </div>
    </div>
  );
}

function Card1() {
  return (
    <div className="absolute bg-white h-[467px] left-0 top-0 w-[630.281px]" data-name="Card">
      <div className="content-stretch flex flex-col items-start overflow-clip p-[0.5px] relative rounded-[inherit] size-full">
        <Container1 />
        <Container2 />
      </div>
      <div aria-hidden className="absolute border-[#c4c4c4] border-[0.5px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Container() {
  return (
    <div className="absolute h-[467px] left-[767.43px] top-[655px] w-[630.281px]" data-name="Container">
      <div className="absolute flex h-[467px] items-center justify-center left-[0.14px] top-0 w-[630px]">
        <div className="-scale-y-100 flex-none rotate-180">
          <Card />
        </div>
      </div>
      <Card1 />
    </div>
  );
}

function Card2() {
  return <div className="bg-[#d9d9d9] border-[#c4c4c4] border-[0.5px] border-solid h-[467px] relative w-[630px]" data-name="Card" />;
}

function Container6() {
  return <div className="bg-[#9b9999] h-[293.578px] relative shrink-0 w-[629.281px]" data-name="Container" />;
}

function Text3() {
  return (
    <div className="relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Archivo:Bold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[20px] text-black whitespace-nowrap">Project Three</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-end relative size-full">
        <Text3 />
      </div>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Archivo:Regular',sans-serif] leading-[19.25px] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">A placeholder description for the third project in the portfolio collection.</p>
      </div>
    </div>
  );
}

function Text4() {
  return (
    <div className="absolute bg-[#f2f2f2] content-stretch flex flex-col h-[31px] items-start left-0 px-[10px] py-[5px] rounded-[2px] top-0" data-name="Text">
      <p className="[word-break:break-word] font-['Archivo:Regular',sans-serif] leading-[21px] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">Design System</p>
    </div>
  );
}

function Container9() {
  return (
    <div className="h-[31px] relative shrink-0 w-[589.281px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text4 />
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="flex-[172.422_0_0] min-h-px relative w-full" data-name="Container">
      <div className="flex flex-col justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[10px] items-start justify-center px-[20px] py-[14px] relative size-full">
          <Container8 />
          <Paragraph1 />
          <Container9 />
        </div>
      </div>
    </div>
  );
}

function Card3() {
  return (
    <div className="absolute bg-white h-[467px] left-0 top-0 w-[630.281px]" data-name="Card">
      <div className="content-stretch flex flex-col items-start overflow-clip p-[0.5px] relative rounded-[inherit] size-full">
        <Container6 />
        <Container7 />
      </div>
      <div aria-hidden className="absolute border-[#c4c4c4] border-[0.5px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute h-[467px] left-[81.12px] top-[655px] w-[630.281px]" data-name="Container">
      <div className="absolute flex h-[467px] items-center justify-center left-[0.14px] top-0 w-[630px]">
        <div className="-scale-y-100 flex-none rotate-180">
          <Card2 />
        </div>
      </div>
      <Card3 />
    </div>
  );
}

function Card4() {
  return <div className="bg-[#d9d9d9] border-[#c4c4c4] border-[0.5px] border-solid h-[467px] relative w-[630px]" data-name="Card" />;
}

function Container11() {
  return <div className="bg-[#9b9999] h-[293.578px] relative shrink-0 w-[629.281px]" data-name="Container" />;
}

function Text5() {
  return (
    <div className="relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Archivo:Bold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[20px] text-black whitespace-nowrap">Project Two</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-end relative size-full">
        <Text5 />
      </div>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Archivo:Regular',sans-serif] leading-[19.25px] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">A placeholder description for the second project in the portfolio collection.</p>
      </div>
    </div>
  );
}

function Text6() {
  return (
    <div className="absolute bg-[#f2f2f2] content-stretch flex flex-col h-[31px] items-start left-0 px-[10px] py-[5px] rounded-[2px] top-0" data-name="Text">
      <p className="[word-break:break-word] font-['Archivo:Regular',sans-serif] leading-[21px] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">UX Research</p>
    </div>
  );
}

function Text7() {
  return (
    <div className="absolute bg-[#f2f2f2] content-stretch flex flex-col h-[31px] items-start left-[110.47px] px-[10px] py-[5px] rounded-[2px] top-0" data-name="Text">
      <p className="[word-break:break-word] font-['Archivo:Regular',sans-serif] leading-[21px] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">Mobile</p>
    </div>
  );
}

function Container14() {
  return (
    <div className="h-[31px] relative shrink-0 w-[589.281px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text6 />
        <Text7 />
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="flex-[172.422_0_0] min-h-px relative w-full" data-name="Container">
      <div className="flex flex-col justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[10px] items-start justify-center px-[20px] py-[14px] relative size-full">
          <Container13 />
          <Paragraph2 />
          <Container14 />
        </div>
      </div>
    </div>
  );
}

function Card5() {
  return (
    <div className="absolute bg-white h-[467px] left-0 top-0 w-[630.281px]" data-name="Card">
      <div className="content-stretch flex flex-col items-start overflow-clip p-[0.5px] relative rounded-[inherit] size-full">
        <Container11 />
        <Container12 />
      </div>
      <div aria-hidden className="absolute border-[#c4c4c4] border-[0.5px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Container10() {
  return (
    <div className="absolute h-[467px] left-[767.43px] top-[152px] w-[630.281px]" data-name="Container">
      <div className="absolute flex h-[467px] items-center justify-center left-[0.14px] top-0 w-[630px]">
        <div className="-scale-y-100 flex-none rotate-180">
          <Card4 />
        </div>
      </div>
      <Card5 />
    </div>
  );
}

function Card6() {
  return <div className="bg-[#d9d9d9] border-[#c4c4c4] border-[0.5px] border-solid h-[467px] relative w-[630px]" data-name="Card" />;
}

function Container16() {
  return <div className="bg-[#9b9999] h-[293.578px] relative shrink-0 w-[629.281px]" data-name="Container" />;
}

function Text8() {
  return (
    <div className="relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Archivo:Bold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[20px] text-black whitespace-nowrap">Halo Conversations</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-end relative size-full">
        <Text8 />
      </div>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Archivo:Regular',sans-serif] leading-[19.25px] not-italic relative shrink-0 text-[14px] text-black w-[590px]">Powered by Microsoft Copilot, Halo Conversations bridges the gaps between sales teams and clients.</p>
      </div>
    </div>
  );
}

function Text9() {
  return (
    <div className="absolute bg-[#f2f2f2] content-stretch flex flex-col h-[31px] items-start left-0 px-[10px] py-[5px] rounded-[2px] top-0" data-name="Text">
      <p className="[word-break:break-word] font-['Archivo:Regular',sans-serif] leading-[21px] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">AI</p>
    </div>
  );
}

function Text10() {
  return (
    <div className="absolute bg-[#f2f2f2] content-stretch flex flex-col h-[31px] items-start left-[41.29px] px-[10px] py-[5px] rounded-[2px] top-0" data-name="Text">
      <p className="[word-break:break-word] font-['Archivo:Regular',sans-serif] leading-[21px] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">Web Application</p>
    </div>
  );
}

function Container19() {
  return (
    <div className="h-[31px] relative shrink-0 w-[589.281px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text9 />
        <Text10 />
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="flex-[172.422_0_0] min-h-px relative w-full" data-name="Container">
      <div className="flex flex-col justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[10px] items-start justify-center px-[20px] py-[14px] relative size-full">
          <Container18 />
          <Paragraph3 />
          <Container19 />
        </div>
      </div>
    </div>
  );
}

function Card7() {
  return (
    <div className="absolute bg-white h-[467px] left-0 top-0 w-[630.281px]" data-name="Card">
      <div className="content-stretch flex flex-col items-start overflow-clip p-[0.5px] relative rounded-[inherit] size-full">
        <Container16 />
        <Container17 />
      </div>
      <div aria-hidden className="absolute border-[#c4c4c4] border-[0.5px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Container15() {
  return (
    <div className="absolute h-[467px] left-[81.12px] top-[152px] w-[630.281px]" data-name="Container">
      <div className="absolute flex h-[467px] items-center justify-center left-[0.14px] top-0 w-[630px]">
        <div className="-scale-y-100 flex-none rotate-180">
          <Card6 />
        </div>
      </div>
      <Card7 />
    </div>
  );
}

function Container20() {
  return <div className="bg-black relative rounded-[2px] shrink-0 size-[16px]" data-name="Container" />;
}

function Link() {
  return (
    <div className="relative shrink-0" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Archivo:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-black whitespace-nowrap">TO START OFF...</p>
      </div>
    </div>
  );
}

function Link1() {
  return (
    <div className="relative shrink-0" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Archivo:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-black whitespace-nowrap">MY CRAFT</p>
      </div>
    </div>
  );
}

function Link2() {
  return (
    <div className="relative shrink-0" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Archivo:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-black whitespace-nowrap">WHO AM I?</p>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[60px] items-center relative size-full">
        <Link />
        <Link1 />
        <Link2 />
      </div>
    </div>
  );
}

function Homepage() {
  return (
    <div className="-translate-x-1/2 absolute bg-[#d9d9d9] content-stretch flex h-[66px] items-center justify-between left-1/2 pb-[0.5px] px-[80px] top-0 w-[1459px]" data-name="Homepage">
      <div aria-hidden className="absolute border-[#c4c4c4] border-b-[0.5px] border-solid inset-0 pointer-events-none" />
      <Container20 />
      <Container21 />
    </div>
  );
}

export default function Ref() {
  return (
    <div className="bg-white relative size-full" data-name="ref 2">
      <p className="[word-break:break-word] absolute font-['Playfair_Display:SemiBold_Italic',sans-serif] font-semibold italic leading-[48px] left-[81.12px] text-[32px] text-black top-[86px] whitespace-nowrap">My Craft</p>
      <Container />
      <Container5 />
      <Container10 />
      <Container15 />
      <Homepage />
    </div>
  );
}