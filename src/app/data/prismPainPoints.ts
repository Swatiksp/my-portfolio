/**
 * The five pain points behind the Prism case study, each backed by excerpts from the stakeholder
 * interviews ("Marcus Interview 1" and "Marcus Interview 2" in the Figma file).
 *
 * Quotes are lightly trimmed for length (… marks omissions) and cleaned of filler words and obvious
 * transcription errors. Names of people and agencies are left out on purpose.
 * `highlight` must be a verbatim substring of `quote`: it is rendered with a marker-pen highlight.
 */
export interface InterviewExcerpt {
  interview: 1 | 2;
  /** Timestamp in the transcript, when it was visible in the source screenshot. */
  time?: string;
  quote: string;
  highlight: string;
}

export interface PainPoint {
  title: string;
  desc: string;
  excerpts: InterviewExcerpt[];
}

export const PAIN_POINTS: PainPoint[] = [
  {
    title: "Tracking reports across channels",
    desc: "Edits arrive through Slack, email, in person and editing software, and are hard to contextualize",
    excerpts: [
      {
        interview: 2,
        time: "06:36",
        quote:
          "What we do is we highlight and then add what we call a comment. But it basically looks like the track changes in a Word document and we put everything, all of our editing suggestions and or changes. And then it goes back to the original reporter.",
        highlight: "it basically looks like the track changes in a Word document",
      },
      {
        interview: 2,
        time: "09:47",
        quote:
          "Depending on the subject matter, it might have to go to various offices… stakeholders in that content and then they add their edits. So if you think about what track changes looks like after a ton of people have given their feedback on it, I’ve seen as much as like a hundred.",
        highlight: "after a ton of people have given their feedback on it, I’ve seen as much as like a hundred",
      },
      {
        interview: 2,
        time: "29:59",
        quote:
          "I have one reporter, when he sends out something for coordination to stakeholders outside of the office, we’ll put on the email, ‘Please remember, this is for coordination for content. We are not looking for grammar or editing.’",
        highlight: "we’ll put on the email",
      },
    ],
  },
  {
    title: "Tedious policy review",
    desc: "Analysts rely on memory and keywords, and “don’t know what they don’t know”",
    excerpts: [
      {
        interview: 2,
        time: "12:46",
        quote:
          "I would say the worst part is looking at the various reporting policies. So if there was sort of an LLM that had all of those policies auto loaded in there and you could run your report against that, it could catch a majority of those things automatically. That would be a huge time saver.",
        highlight: "the worst part is looking at the various reporting policies",
      },
      {
        interview: 2,
        time: "13:21",
        quote:
          "Some of it comes with experience. But basically we have two indexes that are some form of A to Z keyword indexes… you would pull up that index, look for the word coordinates, and then it would link you to an excerpt from that particular policy on how you’re supposed to do it.",
        highlight: "two indexes that are some form of A to Z keyword indexes",
      },
      {
        interview: 2,
        time: "15:03",
        quote:
          "The policies are usually extensive… in a classified one, I think it’s called like the Government Style Manual. And that’s available just like online. And that thing is like a beast. Hundreds and hundreds of pages.",
        highlight: "Hundreds and hundreds of pages",
      },
    ],
  },
  {
    title: "Juggling competing deadlines",
    desc: "He can’t review several high-priority reports at once",
    excerpts: [
      {
        interview: 1,
        time: "07:50",
        quote:
          "If the information has a certain type of imminent, identifiable threat to it, right? Then that information needs to be conveyed pretty quickly… somewhere between a zero to 24 hour time frame.",
        highlight: "somewhere between a zero to 24 hour time frame",
      },
      {
        interview: 1,
        quote:
          "If it was determined… there’s two separate items and they’re both an identifiable threat to life, then you have to have two different individuals, or at least two different individuals, kind of working to get both those items published as quickly as possible.",
        highlight: "you have to have two different individuals",
      },
      {
        interview: 2,
        time: "23:50",
        quote:
          "It may be something that needs to be reported within 24 to 48 hours… everybody on their particular part of it has to kind of like keep that moving at a more expeditious pace.",
        highlight: "reported within 24 to 48 hours",
      },
    ],
  },
  {
    title: "Vague tear lines",
    desc: "Junior reporters misjudge what to leave out, so Marcus corrects and writes feedback",
    excerpts: [
      {
        interview: 2,
        time: "34:10",
        quote:
          "Being able to use an LLM to generate different levels of tear lines is something that people will find very useful and time-saving, because it’s a subjective process. It would not only save time, but also make a more consistent product as you do tear lines.",
        highlight: "it’s a subjective process",
      },
      {
        interview: 2,
        time: "26:23",
        quote:
          "Depending on the reporter for that team, how many times you have to go back to them with the same edits, because at any one time they may just disregard, for no apparent reason, 20% of the edits that you said they needed to make… you may be in a scenario where you have to sit down and explain the policy to them.",
        highlight: "disregard, for no apparent reason, 20% of the edits",
      },
      {
        interview: 2,
        time: "28:46",
        quote:
          "It’s usually only one to two people per team that are actually writing all the reports. So sometimes there can be a disparity between that person, that reporter, and their ability to understand the content of what’s being produced.",
        highlight: "a disparity between that person, that reporter, and their ability to understand the content",
      },
    ],
  },
  {
    title: "No system checks",
    desc: "The process depends on user input alone, so errors slip through",
    excerpts: [
      {
        interview: 2,
        time: "11:45",
        quote:
          "There are some built-in checks for a very bare bones policy, things that it would auto-validate and flag if it isn’t compliant, but that is like extremely high level.",
        highlight: "extremely high level",
      },
      {
        interview: 2,
        time: "10:55",
        quote:
          "The first thing I will do is you can code your comments… it’s up to the individual whether they choose to take that extra… click to say, ‘Is this a content issue? Is it a policy issue? Is it a preference issue?’",
        highlight: "it’s up to the individual whether they choose",
      },
      {
        interview: 2,
        time: "07:34",
        quote:
          "It can be like a multi-step back and forth process where you suggest all the edits, you send it back to them. They change it. And then sometimes they take the changes or they don’t understand it or they just ignore them for whatever reason.",
        highlight: "they just ignore them for whatever reason",
      },
    ],
  },
];
