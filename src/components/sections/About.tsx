import { Panel } from "@/components/Panel";
import { resume, yearsOfExperience } from "@/data/resume";
import styles from "./About.module.css";
import fitz from "@/assets/party/fitz.png";
import keena from "@/assets/party/keena.png";
import koAndJules from "@/assets/party/koandjules.png";
import kota from "@/assets/party/kota.png";
import moon from "@/assets/party/moon.png";
import nyx from "@/assets/party/nyx.png";

const party = [
  {
    id: "koAndJules",
    name: "Ko & Jules",
    src: koAndJules,
    alt: "Pixel-art couple hugging",
    bio: `One of my nicknames is Ko, which is short for ANOTHER nickname of Kotie! My beautiful wife of 10 years is Julia who goes by Jules. She's the single greatest thing in my life and I'd never be where I am now without her. I am a big fan of video games such as: World of Warcraft, Street Fighter, Dark Souls (or anything FromSoftware related). I am trying to learn to be a baker and trying to find the courage to venture into sourdough loafs.`,
  },
  {
    id: "kota",
    name: "Kota",
    src: kota,
    alt: "Pixel-art black and tan dog",
    bio: "Kota is my gorgeous and very dramatic pup. She is a rescue and we aren't totally sure what kind of dog she is though we believe it's a mix of Aussie and Husky. We arrived at that because she has the banshee wail of a husky and the energy of an Aussie. She's around 8 years old, owns the back yard and shows now signs of slowing down",
  },
  {
    id: "keena",
    name: "Keena (RIP)",
    src: keena,
    alt: "Pixel-art black dog wearing a halo",
    bio: "Keena was a very special boy and had been there at the very start of my relationship with Jules. He was a constant source of joy and comfort, and his memory will always hold a special place in my heart. I like to think that he's still around me hiding in my shadow since he was always attached like one and could blend into it pretty easily!",
  },
  {
    id: "moon",
    name: "Moon",
    src: moon,
    alt: "Pixel-art black cat sitting",
    bio: "Moon was found under a truck while Jules and I were out walking Keena and Kota. She was riddled with fleas, super malnourished and even had a kitten with her. We later found that the kitten was probably hers and the rest of the litter didn't survive. We were able to find a loving home for the kitten (who we called Hazel) but we kept Moon as our own. She's now a very sassy and rotund individual who rules the household when she isn't sleeping in the sunlight.",
  },
  {
    id: "nyx",
    name: "Nyx",
    src: nyx,
    alt: "Pixel-art black cat standing",
    bio: "Nyx is a mysterious and elegant goofball. She doesn't walk like a regular cat and her eyes don't really look in the same direction! She was also a rescue and had tons of respiratory issues and had many rounds of antibiotics as a kitten. We think that attributes to her derpy nature. All it's done for us though has given her the most charming and goofy personality you could ever experience.",
  },
  {
    id: "fitz",
    name: "Fitz",
    src: fitz,
    alt: "Pixel-art black and white cat",
    bio: "Fitz, short for Fitzgerald, is the newest addition to the family. He was found in a dumpster with a litter of other cats called 'The Rugrats'. He was the 'Chucky' of the bunch but he really fits his new name in my opinion. His hobbies include terrorizing his sisters, sleeping on mine or Jules face, and doing cat zoomies and the most random times of the day and swatting my monitor because he thinks my mouse is a bug.",
  },
];

export function About() {
  const { basics, education, work } = resume;
  const stats = [
    { label: "Years", value: `${yearsOfExperience()}+` },
    { label: "Companies", value: new Set(work.map((job) => job.company)).size },
    { label: "Base", value: basics.location },
  ];

  return (
    <div className={styles.sections}>
      <div className={styles.layout}>
        <Panel title="About my work!" accent="blue">
          <p className={styles.summary}>{basics.summary}</p>
        </Panel>

        <div className={styles.column}>
          <Panel title="Stats" accent="yellow">
            <dl className={styles.stats}>
              {stats.map((stat) => (
                <div key={stat.label} className={styles.stat}>
                  <dt className={styles.statLabel}>{stat.label}</dt>
                  <dd className={styles.statValue}>{stat.value}</dd>
                </div>
              ))}
            </dl>
          </Panel>

          <Panel title="Training" accent="green">
            <ul className={styles.training}>
              {education.map((item) => (
                <li key={item.institution}>
                  <p className={styles.institution}>{item.institution}</p>
                  <p className={styles.degree}>
                    {item.studyType} · {item.area}
                  </p>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>

      <Panel title="About me!" accent="red">
        <ul className={styles.party} aria-label="Party members">
          {party.map((member) => (
            <li key={member.id} className={styles.member}>
              <img
                src={member.src}
                alt={member.alt}
                className={styles.sprite}
                loading="lazy"
              />
              <div className={styles.blurb}>
                <h3 className={styles.memberName}>{member.name}</h3>
                <p className={styles.bio}>{member.bio}</p>
              </div>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
