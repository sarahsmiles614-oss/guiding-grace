export interface Character {
  id: number;
  name: string;
  title: string;
  type: "hero" | "villain" | "both";
  image?: string;
  era?: string;
  summary?: string;
  story: string;
  keyVerse: string;
  keyVerseReference: string;
  legacy: string;
  didYouKnow?: string;
  reflectionQuestion?: string;
}

export const characters: Character[] = [
  // HEROES
  {
    id: 1,
    name: "David",
    title: "The Shepherd King",
    type: "both",
    era: "1 Samuel - 1 Kings",
    summary: "The shepherd boy who defeated a giant and became Israel's greatest king.",
    story: "He was the youngest of eight brothers, dismissed and overlooked, sent to tend sheep while his older siblings trained for war. When the prophet Samuel came to anoint Israel's next king, no one even bothered to call David in from the fields. But God saw something others missed—a heart fully devoted to Him.\n\nDavid's heroic moment came when a giant named Goliath terrorized Israel's army for 40 days. While seasoned warriors cowered in fear, this teenage shepherd boy stepped forward with nothing but a sling and five smooth stones. 'You come against me with sword and spear,' David declared, 'but I come against you in the name of the Lord Almighty.' One stone. One shot. One giant fell.\n\nBut David's greatest heroism wasn't his victory over Goliath—it was his heart after God. Even when he sinned grievously, he repented genuinely. He danced before the Lord without shame, wrote psalms of worship in his darkest hours, and refused to harm the king who hunted him. From shepherd to songwriter, from fugitive to king, David proved that God doesn't choose the qualified—He qualifies the chosen.",
    keyVerse: "The Lord does not look at the things people look at. People look at the outward appearance, but the Lord looks at the heart.",
    keyVerseReference: "1 Samuel 16:7",
    legacy: "David became Israel's greatest king, ancestor of Jesus Christ, and wrote much of the Psalms that still comfort believers thousands of years later.",
    didYouKnow: "David wrote approximately half of the 150 Psalms in the Bible, composing songs of worship even while running for his life from King Saul in the wilderness.",
    reflectionQuestion: "Where in your life are you being overlooked, and do you trust that God still sees you?"
  },
  {
    id: 2,
    name: "Esther",
    title: "The Unlikely Queen",
    type: "hero",
    era: "Book of Esther",
    summary: "An orphaned Jewish girl who became queen and saved her people from genocide.",
    story: "She was an orphan. A Jewish girl in a foreign land, raised by her cousin Mordecai after her parents died. When the king of Persia threw a beauty pageant to find a new queen, Esther was swept into the palace—not by choice, but by circumstance. Yet God was positioning her for a moment that would save an entire nation.\n\nWhen the evil Haman plotted to annihilate all Jews in the Persian Empire, Esther faced an impossible choice. To speak up meant risking her life—approaching the king uninvited could mean death. To stay silent meant watching her people perish. Her cousin's words pierced her heart: 'Who knows but that you have come to your royal position for such a time as this?'\n\nEsther made her choice. After three days of fasting and prayer, she walked into the throne room, her life hanging by a thread. 'If I perish, I perish,' she had declared. But the king extended his golden scepter, and through her courage and wisdom, she exposed Haman's plot. The Jews were saved, their enemy defeated, and a hidden orphan became a hero who changed history.",
    keyVerse: "And who knows but that you have come to your royal position for such a time as this?",
    keyVerseReference: "Esther 4:14",
    legacy: "Esther's courage saved the Jewish people from genocide, and the festival of Purim still celebrates her bravery today.",
    didYouKnow: "The Book of Esther is one of only two books in the Bible named after women, and it never directly mentions God's name—yet His providence is evident throughout.",
    reflectionQuestion: "What moment in your life might you have been positioned for 'such a time as this'?"
  },
  {
    id: 3,
    name: "Moses",
    title: "The Reluctant Deliverer",
    type: "hero",
    era: "Exodus - Deuteronomy",
    summary: "The stuttering shepherd who confronted Pharaoh and led Israel out of slavery.",
    story: "Born under a death sentence—Pharaoh had ordered all Hebrew baby boys killed—Moses should have died in the Nile. Instead, his mother's faith and a princess's compassion saved him. He grew up in Pharaoh's palace, raised as Egyptian royalty while his people suffered in slavery. When he tried to be a hero on his own terms, killing an Egyptian taskmaster, he failed miserably and fled into the desert.\n\nForty years later, God met him at a burning bush. The mission? Return to Egypt and demand Pharaoh release two million slaves. Moses's response? 'Who am I?' He rattled off excuse after excuse—he wasn't eloquent, wasn't qualified, wasn't confident. But God wasn't asking Moses to go in his own strength. 'I will be with you,' God promised.\n\nWhat followed was the most dramatic rescue operation in history. Ten plagues. A divided sea. Bread from heaven. Water from rocks. Moses led God's people out of slavery, through the wilderness, and to the edge of the Promised Land. He didn't feel like a hero—he argued with God, doubted himself, and made mistakes. But he learned that God's strength is perfected in our weakness, and that obedience matters more than perfection.",
    keyVerse: "My grace is sufficient for you, for my power is made perfect in weakness.",
    keyVerseReference: "2 Corinthians 12:9",
    legacy: "Moses delivered Israel from slavery, received the Ten Commandments, and wrote the first five books of the Bible—the foundation of God's law.",
    didYouKnow: "Moses was 80 years old when God called him at the burning bush, and he lived to be 120—spending his last 40 years leading Israel through the wilderness.",
    reflectionQuestion: "What excuse are you making that's keeping you from obeying God's call on your life?"
  },
  {
    id: 4,
    name: "Ruth",
    title: "The Loyal Daughter",
    type: "hero",
    era: "Book of Ruth",
    summary: "A Moabite widow whose loyalty placed her in the lineage of Christ.",
    story: "When famine and death stripped Naomi of her husband and two sons, she had nothing left—except two foreign daughters-in-law who had no obligation to stay. Orpah left, choosing the security of returning to her family. But Ruth made a choice that would echo through eternity.\n\n'Don't urge me to leave you,' Ruth insisted. 'Where you go I will go, and where you stay I will stay. Your people will be my people and your God my God.' It was a declaration of love, loyalty, and faith. Ruth chose to follow a God she barely knew, to embrace a people who would see her as an outsider, to care for a bitter mother-in-law in a land of strangers.\n\nRuth worked the harvest fields, gleaning leftover grain to keep them alive. Her kindness caught the eye of Boaz, a wealthy relative who recognized her noble character. Their love story became legendary, but the real miracle was what came next. Ruth, the Moabite outsider, became the great-grandmother of King David and an ancestor of Jesus Christ. Her loyalty didn't just change her life—it changed history.",
    keyVerse: "Where you go I will go, and where you stay I will stay. Your people will be my people and your God my God.",
    keyVerseReference: "Ruth 1:16",
    legacy: "Ruth's faithfulness placed her in the lineage of Jesus Christ, proving that God's grace extends to all who seek Him.",
    didYouKnow: "Ruth was a Moabite—a people group descended from Lot's incestuous relationship—yet God placed her in the direct ancestry of both King David and Jesus.",
    reflectionQuestion: "Who in your life needs your unwavering loyalty, even when it costs you something?"
  },
  {
    id: 5,
    name: "Daniel",
    title: "The Fearless Prophet",
    type: "hero",
    era: "Book of Daniel",
    summary: "A captive in Babylon who never compromised his faith, even in the lions' den.",
    story: "Kidnapped as a teenager and exiled to Babylon, Daniel could have abandoned his faith and assimilated into pagan culture. Instead, he drew a line in the sand from day one—refusing to defile himself with the king's food, risking punishment to honor God's laws. That early act of courage set the trajectory for a lifetime of faithfulness.\n\nDecades later, now an old man serving his fourth king, Daniel faced his greatest test. Jealous officials manipulated King Darius into signing a law: pray to anyone but the king for 30 days, and you'll be thrown to the lions. Daniel could have hidden his prayers, prayed silently, or taken a month off. Instead, he opened his windows toward Jerusalem and prayed three times a day—just as he always had.\n\nThe lions' den became his pulpit. All night, with hungry beasts circling, God sent an angel to shut their mouths. When morning came, Daniel emerged unharmed, and his accusers were devoured instead. His unwavering faith had turned a death sentence into a testimony that reached an empire. The king declared that Daniel's God was the living God, and Daniel continued to prosper. Compromise would have saved his life temporarily; faithfulness saved it eternally.",
    keyVerse: "My God sent his angel, and he shut the mouths of the lions. They have not hurt me, because I was found innocent in his sight.",
    keyVerseReference: "Daniel 6:22",
    legacy: "Daniel's prophecies shaped biblical understanding of end times, and his courage inspired generations to stand firm in faith.",
    didYouKnow: "Daniel served under four different kings across two empires (Babylonian and Persian) and remained faithful for over 70 years in exile.",
    reflectionQuestion: "What daily practice of faith are you tempted to hide or compromise to avoid conflict?"
  },
  {
    id: 6,
    name: "Peter",
    title: "The Redeemed Denier",
    type: "both",
    era: "Gospels and Acts",
    summary: "The disciple who denied Jesus three times, then became the rock of the early church.",
    story: "Impulsive. Loud. Overconfident. Peter was the disciple who spoke first and thought later. He walked on water—until he doubted. He declared he'd die for Jesus—then denied Him three times before the rooster crowed. When Jesus was arrested, Peter's courage crumbled. 'I don't know the man,' he swore, abandoning his Lord in His darkest hour.\n\nPeter wept bitterly that night, convinced he'd destroyed everything. But Jesus wasn't done with him. After the resurrection, Jesus pulled Peter aside on a beach. Three times Peter had denied Him; three times Jesus asked, 'Do you love me?' Each 'yes' was a restoration, each commission—'Feed my sheep'—a reinstatement. Jesus transformed Peter's greatest failure into his greatest calling.\n\nFifty days later, filled with the Holy Spirit, Peter stood before thousands in Jerusalem and preached the gospel with such power that 3,000 people believed in one day. The coward became a lion. The denier became the rock. He was eventually crucified upside down for his faith, requesting that position because he felt unworthy to die as Jesus did. Peter's story proves that our worst moments don't disqualify us—they become the canvas for God's greatest grace.",
    keyVerse: "The Lord turned and looked straight at Peter. Then Peter remembered the word the Lord had spoken to him.",
    keyVerseReference: "Luke 22:61",
    legacy: "Peter became a pillar of the early church, wrote two New Testament books, and his preaching launched the Christian movement.",
    didYouKnow: "Peter's original name was Simon, but Jesus renamed him 'Peter' (meaning 'rock') before he ever showed rock-like qualities—speaking to his future, not his present.",
    reflectionQuestion: "What failure in your past are you allowing to define you instead of letting God redeem it?"
  },

  // VILLAINS
  {
    id: 7,
    name: "Judas Iscariot",
    title: "The Betrayer",
    type: "villain",
    era: "Gospels",
    summary: "The disciple who betrayed Jesus for thirty pieces of silver.",
    story: "For three years, Judas walked with Jesus. He witnessed miracles—the blind seeing, the lame walking, the dead rising. He heard teachings that would transform the world. He was trusted enough to hold the money bag for the disciples. Yet somewhere along the way, his heart turned to stone.\n\nThe signs were there. John's Gospel notes that Judas was a thief, skimming from the group's funds. When Mary anointed Jesus with expensive perfume, Judas complained about the 'waste'—not because he cared for the poor, but because he wanted the money for himself. Greed had poisoned his soul, and Satan found an open door.\n\nFor thirty pieces of silver—the price of a slave—Judas agreed to betray the Son of God. In the Garden of Gethsemane, he approached Jesus with a kiss, the prearranged signal for the soldiers to arrest Him. That kiss, meant to express love and respect, became the ultimate act of treachery. When Judas realized what he'd done, guilt consumed him. He returned the money and hanged himself, dying in despair. His name became synonymous with betrayal, a cautionary tale of how proximity to Jesus means nothing if your heart is far from Him.",
    keyVerse: "Then Satan entered Judas, called Iscariot, one of the Twelve.",
    keyVerseReference: "Luke 22:3",
    legacy: "Judas's betrayal fulfilled prophecy but cost him his soul. His story warns that religious activity without genuine faith leads to destruction.",
    didYouKnow: "The thirty pieces of silver Judas received was the exact price prescribed in the Old Testament as compensation for a slave accidentally killed by an ox.",
    reflectionQuestion: "What 'small' compromise in your life might be opening a door to larger betrayals?"
  },
  {
    id: 8,
    name: "Jezebel",
    title: "The Wicked Queen",
    type: "villain",
    era: "1 Kings",
    summary: "The queen who murdered prophets and promoted Baal worship in Israel.",
    story: "When Jezebel married King Ahab of Israel, she didn't just become queen—she declared war on God Himself. A Phoenician princess devoted to the demon-god Baal, she systematically murdered God's prophets, erected altars to false gods throughout Israel, and bullied her weak husband into abandoning the faith of his fathers.\n\nHer wickedness reached its peak when she coveted Naboth's vineyard. When he refused to sell his family inheritance, Jezebel forged letters in the king's name, arranged false testimony, and had Naboth stoned to death. Then she gave the vineyard to her pouting husband as a gift. Murder meant nothing to her if it served her desires.\n\nGod sent the prophet Elijah with a message: 'Dogs will devour Jezebel by the wall of Jezreel.' She laughed at the prophecy. But years later, when Jehu came to execute God's judgment, Jezebel painted her face and mocked him from a window. Jehu ordered her thrown down; she hit the pavement, and before they could bury her, wild dogs devoured her corpse—just as Elijah had prophesied. Only her skull, feet, and hands remained. Jezebel's name endures as a symbol of manipulative evil and defiance against God.",
    keyVerse: "There was never anyone like Ahab, who sold himself to do evil in the eyes of the Lord, urged on by Jezebel his wife.",
    keyVerseReference: "1 Kings 21:25",
    legacy: "Jezebel's legacy is so dark that Revelation uses her name as a warning against false teaching and sexual immorality in the church.",
    didYouKnow: "Jezebel's death was so complete that when servants went to bury her, they found only her skull, feet, and palms—the parts dogs wouldn't eat.",
    reflectionQuestion: "Are you using your influence to draw people toward God or away from Him?"
  },
  {
    id: 9,
    name: "Pharaoh",
    title: "The Hardened Heart",
    type: "villain",
    era: "Exodus",
    summary: "The Egyptian king whose pride led to ten plagues and the death of his army.",
    story: "He ruled the most powerful empire on earth, a god-king who bowed to no one. When Moses came demanding freedom for the Hebrew slaves, Pharaoh laughed. 'Who is the Lord that I should obey Him?' he sneered. His pride would cost him everything.\n\nGod sent plague after plague—water turned to blood, frogs, gnats, flies, diseased livestock, boils, hail, locusts, darkness. Each time Pharaoh promised to let the people go, then changed his mind once the plague ended. His heart grew harder with each rebellion. Power had made him deaf to reason and blind to truth.\n\nThe tenth plague broke him. Every firstborn son in Egypt died in one night—including Pharaoh's own heir. In anguish, he finally released the Israelites. But even that wasn't enough. Blinded by rage and pride, Pharaoh pursued them to the Red Sea with his entire army. God parted the waters for Israel, but when Pharaoh's chariots charged in, the sea collapsed. He drowned with his army, a powerful reminder that no earthly authority can stand against God. Pharaoh's stubbornness didn't just cost him his throne—it cost him his life, his heir, and his legacy.",
    keyVerse: "But Pharaoh hardened his heart and would not listen to them, just as the Lord had said.",
    keyVerseReference: "Exodus 7:13",
    legacy: "Pharaoh's story demonstrates the danger of pride and the consequences of resisting God's will.",
    didYouKnow: "Scholars debate which Pharaoh opposed Moses, but the Bible intentionally doesn't name him—focusing on his choice to harden his heart, not his identity.",
    reflectionQuestion: "What warnings from God are you ignoring because you're too proud to change?"
  },
  {
    id: 10,
    name: "Herod the Great",
    title: "The Jealous King",
    type: "villain",
    era: "Matthew 2",
    summary: "The paranoid king who massacred babies trying to kill the infant Jesus.",
    story: "Paranoid. Ruthless. Power-hungry. Herod the Great murdered anyone he perceived as a threat—including his own wife and sons. When wise men from the East arrived in Jerusalem asking, 'Where is the one who has been born king of the Jews?' Herod's blood ran cold. Another king? Impossible.\n\nHerod summoned the wise men and pretended to worship this newborn king. 'Go and search carefully for the child,' he instructed with false sincerity. 'When you find him, report to me, so that I too may go and worship him.' But his true intention was murder. When the wise men didn't return—warned by God in a dream—Herod's rage exploded.\n\nHis solution was monstrous: kill every male child in Bethlehem under two years old. Innocent babies were ripped from their mothers' arms and slaughtered, all to eliminate one potential rival. The massacre filled the streets with blood and the air with mothers' wails. Jesus escaped to Egypt, but Herod's evil left scars on an entire generation. He died shortly after, eaten by worms and disease—a fitting end for a man who tried to murder the Messiah.",
    keyVerse: "When Herod realized that he had been outwitted by the Magi, he was furious, and he gave orders to kill all the boys in Bethlehem.",
    keyVerseReference: "Matthew 2:16",
    legacy: "Herod's attempt to destroy Jesus fulfilled prophecy and demonstrated that human evil cannot thwart God's redemptive plan.",
    didYouKnow: "Herod's paranoia was so extreme that Caesar Augustus reportedly said, 'It's better to be Herod's pig than his son'—pigs were safe, but Herod killed his own children.",
    reflectionQuestion: "What fear is driving you to destructive behavior toward others?"
  },
  {
    id: 11,
    name: "Cain",
    title: "The First Murderer",
    type: "villain",
    era: "Genesis 4",
    summary: "Adam's son who murdered his brother Abel out of jealousy.",
    story: "History's first villain was born to history's first parents. Cain and his brother Abel both brought offerings to God, but God looked with favor on Abel's sacrifice and not Cain's. Jealousy took root in Cain's heart like poison ivy, choking out reason and love.\n\nGod saw the darkness growing and warned Cain: 'Sin is crouching at your door; it desires to have you, but you must rule over it.' It was a lifeline, a chance to choose differently. But Cain refused. He invited Abel into the field and murdered him—the first spilled blood on earth was brother killing brother.\n\nWhen God asked, 'Where is your brother?' Cain's response revealed his depravity: 'Am I my brother's keeper?' He felt no remorse, only defensiveness. God cursed him to wander the earth, and Cain complained that the punishment was too harsh. Even in judgment, he couldn't see the horror of his sin. He became a fugitive, marked by God, forever wandering—a living warning that unchecked envy and anger lead to death.",
    keyVerse: "If you do what is right, will you not be accepted? But if you do not do what is right, sin is crouching at your door.",
    keyVerseReference: "Genesis 4:7",
    legacy: "Cain's story shows how jealousy and unrepentant sin lead to destruction, and his name became synonymous with murderous envy.",
    didYouKnow: "Cain built the world's first recorded city and named it after his son Enoch, attempting to create a legacy despite God's curse of wandering.",
    reflectionQuestion: "What jealousy are you nurturing that could lead to destructive actions?"
  },
  {
    id: 12,
    name: "Pontius Pilate",
    title: "The Coward",
    type: "villain",
    era: "Gospels",
    summary: "The Roman governor who sentenced Jesus to death despite knowing He was innocent.",
    story: "Pilate knew Jesus was innocent. He said it publicly—three times. 'I find no basis for a charge against this man.' His wife sent him a message: 'Don't have anything to do with that innocent man.' Even Jesus's accusers couldn't get their stories straight. Every piece of evidence screamed for Jesus's release.\n\nBut Pilate was a politician first and a man second. He saw the angry mob, heard their threats to report him to Caesar, and calculated the cost to his career. Justice lost to convenience. Truth lost to crowd control. He literally washed his hands, as if symbolic gestures could cleanse actual guilt.\n\n'Crucify him!' the people shouted. Pilate knew it was wrong. He knew Jesus was innocent. He had the authority to stop it. But instead, he handed Jesus over to be tortured and executed. He chose his position over righteousness, his comfort over courage. Pilate thought he was washing his hands of responsibility, but history remembers him as the man who condemned the Son of God. Every time the Apostles' Creed is recited—'crucified under Pontius Pilate'—his cowardice is immortalized.",
    keyVerse: "When Pilate saw that he was getting nowhere, he took water and washed his hands in front of the crowd. 'I am innocent of this man's blood,' he said.",
    keyVerseReference: "Matthew 27:24",
    legacy: "Pilate's failure to stand for truth made him complicit in the crucifixion, and his name is forever linked to the death of Jesus.",
    didYouKnow: "Pilate's wife is the only woman in the Gospels who tried to prevent Jesus's crucifixion, sending her husband a message warning him about a troubling dream.",
    reflectionQuestion: "When have you chosen comfort and approval over doing what you knew was right?"
  },
  {
    id: 13,
    name: "Abraham",
    title: "The Father of Faith",
    type: "hero",
    era: "Genesis 12-25",
    summary: "The father of faith who trusted God's promises for 25 years.",
    story: "At 75 years old, Abraham heard God's call to leave everything—his country, his people, his father's household—and go to a land he'd never seen. No GPS. No roadmap. Just a promise: 'I will make you into a great nation.' Most men his age would laugh. Abraham packed his bags.\n\nFor 25 years, he waited for the promised son. His wife Sarah was barren, and with each passing year, the promise seemed more impossible. But Abraham 'did not waver through unbelief regarding the promise of God, but was strengthened in his faith.' When Isaac finally arrived, Abraham's joy was complete. Then came the test that would define him forever.\n\n'Take your son, your only son Isaac, whom you love, and sacrifice him.' The command was horrifying. But Abraham had learned to trust God's character even when he couldn't understand God's ways. He took Isaac up the mountain, raised the knife—and God provided a ram in the thicket. Abraham's willingness to surrender his most precious gift proved his faith was genuine. He became the father of all who believe, showing that faith isn't the absence of questions—it's the choice to trust God's promises over our circumstances.",
    keyVerse: "Abraham believed God, and it was credited to him as righteousness.",
    keyVerseReference: "Romans 4:3",
    legacy: "Abraham's faith established the covenant that led to Israel and ultimately to Jesus Christ, making him the father of all believers.",
    didYouKnow: "Abraham was 100 years old when Isaac was born, and Sarah was 90—making their son a miraculous fulfillment of God's promise.",
    reflectionQuestion: "What promise from God are you struggling to believe while you wait?"
  },
  {
    id: 14,
    name: "Joshua",
    title: "The Conqueror",
    type: "hero",
    era: "Book of Joshua",
    summary: "Moses's successor who led Israel to conquer the Promised Land.",
    story: "He stood in Moses's shadow for forty years—the faithful assistant, the military commander, the right-hand man. When the people refused to enter the Promised Land in fear, only Joshua and Caleb stood firm: 'If the Lord is pleased with us, He will give us this land.' They were outvoted, and the entire generation died in the wilderness. Only Joshua and Caleb survived to see the promise.\n\nWhen Moses died, God gave Joshua an impossible mission: lead Israel into a land filled with giants and fortified cities. The first words God spoke to him were these: 'Be strong and courageous.' Not once, not twice, but three times in one conversation—because God knew the weight Joshua carried.\n\nJoshua's first test was Jericho—walls so thick that chariots could race on top. God's battle plan was bizarre: march around the city for seven days, then shout. No battering rams. No siege tactics. Just obedience. When the walls fell flat, Israel learned that victory comes through faith, not force. Joshua conquered the Promised Land not through his own strength but by following God's commands exactly. His legacy? 'As for me and my household, we will serve the Lord.'",
    keyVerse: "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.",
    keyVerseReference: "Joshua 1:9",
    legacy: "Joshua led Israel into the Promised Land and distributed the inheritance to the tribes, fulfilling God's ancient promise to Abraham.",
    didYouKnow: "Joshua is one of only two people from the generation that left Egypt who entered the Promised Land—the other was Caleb.",
    reflectionQuestion: "What 'impossible' wall is God calling you to march around in faith?"
  },
  {
    id: 15,
    name: "Deborah",
    title: "The Warrior Judge",
    type: "hero",
    era: "Judges 4-5",
    summary: "The only female judge of Israel who led the nation to victory.",
    story: "In a culture where women were rarely leaders, Deborah sat under a palm tree and judged Israel with wisdom that drew people from across the nation. She was a prophet, a judge, and a military strategist—all roles typically reserved for men. But God doesn't follow human conventions.\n\nWhen Israel cried out for deliverance from Canaanite oppression, God spoke through Deborah. She summoned Barak, the military commander, and delivered God's battle plan: take ten thousand men and defeat Sisera's army. Barak's response revealed his faith—or lack thereof: 'I'll go if you come with me.' Deborah agreed but prophesied that the honor of victory would go to a woman.\n\nThe battle was fierce, but God threw Sisera's forces into confusion. Sisera fled on foot and sought refuge in the tent of Jael, an unlikely hero. While he slept, Jael drove a tent peg through his temple, fulfilling Deborah's prophecy. Deborah led Israel to 40 years of peace, proving that God equips those He calls, regardless of gender, age, or background. Her song of victory remains one of the most powerful poems in Scripture.",
    keyVerse: "She held court under the Palm of Deborah, and the Israelites went up to her to have their disputes decided.",
    keyVerseReference: "Judges 4:5",
    legacy: "Deborah broke gender barriers and led Israel to victory, showing that God's calling transcends human limitations.",
    didYouKnow: "Deborah's victory song in Judges 5 is one of the oldest pieces of Hebrew poetry, possibly dating to the 12th century BC.",
    reflectionQuestion: "How is God calling you to lead in ways that might challenge cultural expectations?"
  },
  {
    id: 16,
    name: "Elijah",
    title: "The Fire Prophet",
    type: "hero",
    era: "1 Kings 17 - 2 Kings 2",
    summary: "The fiery prophet who called down fire from heaven and never died.",
    story: "He appeared out of nowhere to confront King Ahab: 'There will be neither dew nor rain except at my word.' For three years, drought ravaged Israel as judgment for their idolatry. Then Elijah issued a challenge that would shake the nation: a showdown on Mount Carmel between the God of Israel and the 450 prophets of Baal.\n\nThe contest was simple: whichever god answered by fire was the true God. Baal's prophets danced, shouted, and cut themselves from morning till evening. Nothing. Then Elijah stepped forward, drenched his altar with water three times, and prayed one simple prayer. Fire fell from heaven so fierce it consumed the sacrifice, the wood, the stones, the soil, and licked up the water in the trench. The people fell on their faces: 'The Lord—He is God!'\n\nBut even heroes struggle. After his greatest victory, Jezebel's death threat sent Elijah running into the desert, suicidal and exhausted. God met him there—not in the earthquake, wind, or fire, but in a gentle whisper. Elijah learned that ministry isn't about spectacular moments but steady obedience. He never died—God took him to heaven in a whirlwind of fire, a fitting exit for the prophet who called down flames.",
    keyVerse: "Answer me, Lord, answer me, so these people will know that you, Lord, are God, and that you are turning their hearts back again.",
    keyVerseReference: "1 Kings 18:37",
    legacy: "Elijah confronted idolatry with holy fire and is prophesied to return before the great day of the Lord.",
    didYouKnow: "Elijah appeared with Moses at Jesus's transfiguration 900 years after his departure, and Malachi prophesied he would return before the Messiah.",
    reflectionQuestion: "When have you felt spiritually exhausted after a great victory, and how did God meet you?"
  },
  {
    id: 17,
    name: "Mary, Mother of Jesus",
    title: "The Chosen Vessel",
    type: "hero",
    era: "Luke 1-2, Acts 1",
    summary: "The young virgin chosen to bear the Messiah and Savior of the world.",
    story: "She was a teenage girl in an insignificant village, engaged to a carpenter, living an ordinary life. Then the angel Gabriel appeared with the most extraordinary announcement in history: 'You will conceive and give birth to a son, and you are to call him Jesus. He will be great and will be called the Son of the Most High.'\n\nMary's question wasn't 'Why me?' but 'How will this be?' When Gabriel explained, she gave the response that would change everything: 'I am the Lord's servant. May your word to me be fulfilled.' In that moment, Mary surrendered her reputation, her safety, her plans—everything—to become the mother of the Messiah.\n\nShe endured Joseph's initial doubt, the shame of pregnancy before marriage, a desperate journey to Bethlehem, and giving birth in a stable. She treasured the shepherds' testimony and pondered the wise men's gifts. Years later, she stood at the foot of the cross and watched her son die. But she also witnessed the resurrection and joined the disciples in the upper room at Pentecost. Mary's faith never wavered. She said yes to God, and through her obedience, salvation came to the world.",
    keyVerse: "I am the Lord's servant. May your word to me be fulfilled.",
    keyVerseReference: "Luke 1:38",
    legacy: "Mary's faithfulness made her the mother of Jesus Christ, forever honored as the woman who bore the Savior of the world.",
    didYouKnow: "Mary was likely between 12-14 years old when the angel appeared—the typical age for betrothal in first-century Jewish culture.",
    reflectionQuestion: "What is God asking you to surrender that feels like it will cost you everything?"
  },
  {
    id: 18,
    name: "Paul",
    title: "The Transformed Persecutor",
    type: "both",
    era: "Acts, Epistles",
    summary: "The former persecutor who became Christianity's greatest missionary.",
    story: "His original name was Saul, and he was Christianity's greatest enemy. A Pharisee zealot, he hunted Christians with ruthless efficiency, dragging men and women to prison and approving their execution. He stood by, holding the coats of those who stoned Stephen, the first Christian martyr. If anyone was beyond redemption, it was Saul.\n\nThen, on the road to Damascus, a light from heaven blinded him. Jesus spoke: 'Saul, Saul, why do you persecute me?' In that moment, the persecutor became the persecuted, the hunter became the hunted—by grace. For three days he sat in darkness, fasting and praying, until Ananias came and restored his sight. Saul became Paul, and the transformation was total.\n\nPaul planted churches across the Roman Empire, wrote half the New Testament, and endured beatings, shipwrecks, imprisonment, and constant danger. He called himself 'the worst of sinners,' yet declared, 'By the grace of God I am what I am.' His missionary journeys spread the gospel to the Gentiles, and his letters still shape Christian theology today. He was eventually martyred in Rome, beheaded for his faith. Paul proved that no one is beyond God's reach, and no past disqualifies you from God's purpose.",
    keyVerse: "But by the grace of God I am what I am, and his grace to me was not without effect.",
    keyVerseReference: "1 Corinthians 15:10",
    legacy: "Paul spread the gospel across the Roman world and wrote much of the New Testament, transforming Christianity into a global faith.",
    didYouKnow: "Paul wrote at least 13 New Testament books and traveled over 10,000 miles on foot and by ship spreading the gospel.",
    reflectionQuestion: "What part of your past are you letting God redeem for His purposes?"
  },
  {
    id: 19,
    name: "Samson",
    title: "The Fallen Strong Man",
    type: "both",
    era: "Judges 13-16",
    summary: "The supernaturally strong judge whose moral weakness led to his downfall.",
    story: "Born as a miracle to barren parents, Samson was set apart as a Nazirite from birth—never to cut his hair or drink wine, consecrated to God's purpose. The Spirit of the Lord gave him supernatural strength. He killed a lion with his bare hands, defeated a thousand Philistines with a donkey's jawbone, and carried off the gates of Gaza. But his greatest strength became his greatest weakness.\n\nSamson couldn't control his desires. He fell for Delilah, a Philistine woman who was paid to discover the source of his power. Three times she betrayed him, and three times he lied. Finally, worn down by her nagging, he told the truth: his hair. While he slept, she cut it, and his strength left him. The Philistines captured him, gouged out his eyes, and made him grind grain like an animal.\n\nBlinded and broken, Samson had time to reflect on his wasted potential. But God grants second chances. At a pagan festival, Samson prayed one last time: 'Let me die with the Philistines.' He pushed the temple pillars, and the building collapsed, killing more Philistines in his death than in his life. Samson's story is tragic—a warning that gifting without character leads to destruction, but also a reminder that even in our failure, God can bring redemption.",
    keyVerse: "Lord, remember me. Please, God, strengthen me just once more.",
    keyVerseReference: "Judges 16:28",
    legacy: "Samson's strength and tragic fall remind us that God's gifts require stewardship, yet His mercy extends even to the broken.",
    didYouKnow: "Samson judged Israel for 20 years, and his final act of bringing down the Philistine temple killed about 3,000 people.",
    reflectionQuestion: "What gift has God given you that you're wasting through lack of self-control?"
  },
  {
    id: 20,
    name: "Ahab",
    title: "The Puppet King",
    type: "villain",
    era: "1 Kings 16-22",
    summary: "The weak king controlled by his wicked wife Jezebel.",
    story: "Ahab had everything—power, wealth, a throne—but he was the weakest king Israel ever had. His fatal mistake? Marrying Jezebel. From that moment, he was a puppet with Jezebel pulling the strings. She introduced Baal worship, murdered God's prophets, and turned Israel into a spiritual wasteland. Ahab let it all happen.\n\nWhen the prophet Elijah humiliated Baal's prophets on Mount Carmel, proving that the Lord is God, Ahab should have repented. Instead, he ran home and told Jezebel, who immediately threatened Elijah's life. Ahab was more afraid of his wife than of God. His weakness enabled evil to flourish.\n\nThe final straw came with Naboth's vineyard. Ahab wanted it; Naboth refused to sell his family inheritance. Like a spoiled child, Ahab sulked in bed, refusing to eat. Jezebel mocked his weakness and arranged Naboth's murder. When Elijah confronted him with God's judgment, Ahab briefly repented—but it was too shallow to last. He died in battle, his blood licked up by dogs exactly as prophesied. Ahab proves that passive participation in evil is still evil, and that weak men who enable wicked people share in their guilt.",
    keyVerse: "There was never anyone like Ahab, who sold himself to do evil in the eyes of the Lord, urged on by Jezebel his wife.",
    keyVerseReference: "1 Kings 21:25",
    legacy: "Ahab's weakness and compromise made him complicit in his wife's evil, teaching that passive leaders enable destruction.",
    didYouKnow: "Ahab actually won every military battle he fought, but his spiritual compromise made him one of Israel's worst kings.",
    reflectionQuestion: "Who in your life are you allowing to pull you away from God?"
  },
  {
    id: 21,
    name: "King Saul",
    title: "The Jealous King",
    type: "villain",
    era: "1 Samuel",
    summary: "Israel's first king who lost everything through disobedience and jealousy.",
    story: "Saul started as Israel's unlikely hero—tall, handsome, and humble enough to hide among the baggage when chosen as king. God's Spirit empowered him, and he led Israel to military victories. But success corrupted him. When Samuel delayed arriving for a sacrifice, Saul grew impatient and performed it himself, directly disobeying God's command. 'You have acted foolishly,' Samuel declared. 'Your kingdom will not endure.'\n\nSaul's second act of disobedience was worse. Commanded to completely destroy the Amalekites, he kept the best livestock and spared King Agag. When confronted, Saul made excuses: the people made me do it, we kept the animals to sacrifice to God. Samuel's response cut to the heart: 'To obey is better than sacrifice.' God rejected Saul as king that day.\n\nWhat followed was a tragic descent into madness. When young David killed Goliath and became a national hero, jealousy consumed Saul. He spent years hunting David through the wilderness, trying to kill the man God had chosen to replace him. He consulted a witch in desperation. He killed 85 priests for helping David. Saul died by suicide on a battlefield, a cautionary tale of how disobedience and jealousy destroy even those chosen by God.",
    keyVerse: "To obey is better than sacrifice, and to heed is better than the fat of rams.",
    keyVerseReference: "1 Samuel 15:22",
    legacy: "Saul's jealousy and disobedience cost him his kingdom and his life, proving that God values obedience over position.",
    didYouKnow: "Saul stood head and shoulders above everyone else in Israel, yet his insecurity and jealousy consumed him.",
    reflectionQuestion: "What blessing are you at risk of losing because you're more concerned with people's approval than God's?"
  },
  {
    id: 22,
    name: "Gehazi",
    title: "The Greedy Servant",
    type: "villain",
    era: "2 Kings 5",
    summary: "Elisha's servant who contracted leprosy for lying and stealing.",
    story: "Gehazi was servant to Elisha, one of the greatest prophets in Israel. He witnessed miracles—water purified, oil multiplied, a dead boy raised to life, Naaman's leprosy healed. He walked daily with a man of God, learning and serving. But his heart was never transformed.\n\nWhen Naaman offered Elisha payment for healing his leprosy, Elisha refused: 'As surely as the Lord lives, I will not accept a thing.' But Gehazi watched the gold and silver leave and thought, 'My master was too easy on this foreigner. I'll run after him and get something.' He lied to Naaman, claiming Elisha had sent him to collect payment for visiting prophets.\n\nGehazi hid the silver in his house and returned to Elisha, lying again: 'I didn't go anywhere.' But prophets see what others can't. Elisha knew everything: 'Was this the time to take money? Because of what you've done, Naaman's leprosy will cling to you and your descendants forever.' Gehazi left Elisha's presence leprous, white as snow. His greed cost him everything—his health, his position, his legacy. Proximity to holiness doesn't guarantee transformation; character must change from the inside out.",
    keyVerse: "Is this the time to take money or to accept clothes? Naaman's leprosy will cling to you and to your descendants forever.",
    keyVerseReference: "2 Kings 5:26-27",
    legacy: "Gehazi's greed despite seeing God's power warns that religious privilege means nothing without a transformed heart.",
    didYouKnow: "Gehazi appears earlier in 2 Kings as a faithful servant who helped a Shunammite woman, showing how gradually greed corrupted him.",
    reflectionQuestion: "What 'small' act of dishonesty are you rationalizing that could lead to greater consequences?"
  },
  {
    id: 23,
    name: "Haman",
    title: "The Arrogant Schemer",
    type: "villain",
    story: "Haman had everything—wealth, position, the king's favor. King Xerxes promoted him above all nobles, and everyone was commanded to bow when he passed. Everyone bowed—except Mordecai the Jew, who bowed only to God. That one man's refusal drove Haman into murderous rage.\n\nBut killing Mordecai wasn't enough for Haman's wounded pride. He plotted to exterminate every Jew in the entire Persian Empire—men, women, and children. He manipulated the king with lies, cast lots to choose the date of genocide, and even built a gallows 75 feet high specifically for Mordecai. His arrogance knew no bounds.\n\nThen came the banquet. Queen Esther revealed her identity and exposed Haman's plot to annihilate her people. The king was furious. When he returned from the garden, he found Haman falling on Esther's couch, begging for mercy—which looked like an assault. 'Will he even molest the queen in my presence?' the king roared. Haman was dragged out and hanged on the very gallows he'd built for Mordecai. His pride literally became his downfall, and the Jews he tried to destroy celebrated their deliverance with a festival that continues 2,500 years later.",
    keyVerse: "Pride goes before destruction, a haughty spirit before a fall.",
    keyVerseReference: "Proverbs 16:18",
    legacy: "Haman's genocidal plot was thwarted by Esther's courage, and he died on his own gallows—a perfect picture of evil's self-destruction."
  },
  {
    id: 24,
    name: "Ananias and Sapphira",
    title: "The Liars",
    type: "villain",
    story: "The early church was a beautiful picture of generosity. Believers sold properties and laid the proceeds at the apostles' feet to help those in need. Barnabas sold a field and gave everything. Ananias and Sapphira saw the praise he received and wanted the same reputation—without the same sacrifice.\n\nThey sold property but secretly kept back part of the money while claiming to give it all. It was calculated deception, a performance of generosity to gain social capital. They wanted to look like heroes while keeping their safety net. Peter, filled with the Holy Spirit, saw through the charade.\n\n'Ananias, how is it that Satan has so filled your heart that you have lied to the Holy Spirit?' Peter asked. 'You didn't lie to men but to God.' Ananias collapsed and died on the spot. Three hours later, his wife Sapphira arrived, not knowing what had happened. She repeated the lie. Peter confronted her: 'How could you conspire to test the Spirit of the Lord?' She fell dead at his feet. Their deaths weren't about the money—it was theirs to keep or give. It was about lying to God and treating His Spirit with contempt. Their story is a sobering reminder that God sees past our performances to our true motives.",
    keyVerse: "You have not lied just to human beings but to God.",
    keyVerseReference: "Acts 5:4",
    legacy: "Ananias and Sapphira's sudden deaths remind believers that hypocrisy and lying to God carry severe consequences."
  },
  {
    id: 25,
    name: "Joseph",
    title: "The Dreamer Who Forgave",
    type: "hero",
    story: "His brothers hated him. The coat of many colors, the dreams of greatness, their father's obvious favoritism—it all built into murderous rage. They threw him in a pit, sold him to slave traders, and told their father he was dead. At 17, Joseph's life shattered.\n\nBut betrayal was just the beginning. Sold to Potiphar in Egypt, Joseph worked his way to overseer—until Potiphar's wife tried to seduce him. When he refused, she falsely accused him of assault. Innocent, Joseph spent years in prison. Most would grow bitter. Joseph kept trusting God.\n\nIn prison, he interpreted dreams for Pharaoh's cupbearer and baker. The cupbearer promised to remember Joseph but forgot him for two more years. Then Pharaoh had troubling dreams. Finally, the cupbearer remembered. Joseph interpreted the dreams—seven years of plenty, seven of famine—and Pharaoh made him second-in-command of Egypt.\n\nWhen famine drove his brothers to Egypt begging for food, they stood before Joseph without recognizing him. He had the power to destroy them. Instead, he wept and said, 'You intended to harm me, but God intended it for good to accomplish what is now being done, the saving of many lives.' Joseph's forgiveness saved his family and became the seed of Israel.",
    keyVerse: "You intended to harm me, but God intended it for good to accomplish what is now being done, the saving of many lives.",
    keyVerseReference: "Genesis 50:20",
    legacy: "Joseph's forgiveness preserved Israel during famine, and his faithfulness in suffering became a model of trusting God's sovereignty."
  },
  {
    id: 26,
    name: "Gideon",
    title: "The Reluctant Warrior",
    type: "hero",
    story: "When the angel appeared declaring 'The Lord is with you, mighty warrior,' Gideon was hiding in a winepress, threshing wheat in secret because he was terrified of enemy raiders. Mighty warrior? He was the least in his family, from the weakest clan in Israel. But God sees potential where we see impossibility.\n\nGod called Gideon to save Israel from the Midianites who had oppressed them for seven years. Gideon's response was doubt: 'If the Lord is with us, why has all this happened?' He asked for sign after sign—wet fleece, dry ground, then reversed. God patiently reassured him every time.\n\nGideon raised an army of 32,000 men. God said it was too many—Israel might think they won by their own strength. Reduce it. After tests, only 300 remained. Against a Midianite army 'thick as locusts,' Gideon gave his tiny force trumpets, jars, and torches. At midnight, they surrounded the enemy camp, broke their jars, blew their trumpets, and shouted. The Midianites panicked and turned on each other in confusion.\n\nGideon learned that God doesn't need impressive credentials or overwhelming numbers—He needs willing hearts. The weak became strong, the fearful became courageous, and 300 men with God defeated thousands.",
    keyVerse: "The Lord is with you, mighty warrior.",
    keyVerseReference: "Judges 6:12",
    legacy: "Gideon's victory with 300 men proved that God's power is made perfect in weakness and small beginnings."
  },
  {
    id: 27,
    name: "Hannah",
    title: "The Praying Mother",
    type: "hero",
    story: "Year after year, Hannah went to the temple to pray, and year after year, her womb remained empty. In a culture where a woman's worth was measured by sons, she was mocked and pitiful. Her husband's other wife, Peninnah, taunted her mercilessly. The pain drove Hannah to desperate prayer.\n\nOne year at the temple, Hannah prayed with such anguish that the priest Eli thought she was drunk. Her lips moved but no sound came out—she was pouring out her soul to God. 'I am a woman who is deeply troubled,' she explained. 'I have been praying out of my great anguish and grief.' She made a vow: if God gave her a son, she would dedicate him to the Lord's service.\n\nGod heard her prayer. She conceived and gave birth to Samuel, who would become one of Israel's greatest prophets. But Hannah kept her promise. When Samuel was weaned, she brought him to the temple and left him there to serve the Lord. Her sacrifice was total, her faith unwavering.\n\nHannah's prayer of thanksgiving became one of Scripture's most beautiful poems, echoed centuries later in Mary's Magnificat. She learned that God doesn't forget the forgotten, and that prayers prayed in tears can change the course of history.",
    keyVerse: "I prayed for this child, and the Lord has granted me what I asked of him.",
    keyVerseReference: "1 Samuel 1:27",
    legacy: "Hannah's faithful prayer and sacrifice gave Israel the prophet Samuel, and her song inspired generations of worship."
  },
  {
    id: 28,
    name: "Stephen",
    title: "The First Martyr",
    type: "hero",
    story: "Stephen was one of seven men chosen to serve tables in the early church so the apostles could focus on prayer and teaching. But Stephen was more than a waiter. He was 'full of God's grace and power' and performed great wonders and signs. When he spoke about Jesus, his wisdom was irrefutable.\n\nThe religious leaders couldn't stand it. They hired false witnesses to accuse him of blasphemy and dragged him before the Sanhedrin. As Stephen stood trial, his face glowed like an angel's. Then he delivered a history lesson—recounting how Israel had always rejected God's messengers, from Joseph to Moses to the prophets—and now they'd betrayed and murdered the Messiah.\n\nThe council was enraged. They covered their ears and rushed at him. They dragged him outside the city and began stoning him. As rocks crushed his body, Stephen looked up and saw 'heaven open and the Son of Man standing at the right hand of God.' His final words echoed Jesus: 'Lord, do not hold this sin against them.' Then he died.\n\nA young man named Saul watched it all, holding the coats of those who threw stones. Stephen's death and forgiveness planted a seed that would transform Saul into Paul, Christianity's greatest evangelist. The first martyr's blood became seed for the church's explosive growth.",
    keyVerse: "Lord, do not hold this sin against them.",
    keyVerseReference: "Acts 7:60",
    legacy: "Stephen's martyrdom sparked persecution that spread the gospel beyond Jerusalem and influenced Paul's conversion."
  },
  {
    id: 29,
    name: "John the Baptist",
    title: "The Voice in the Wilderness",
    type: "hero",
    story: "He lived in the desert, wore camel hair, ate locusts and wild honey, and preached a message that made religious people furious and sinners repentant. John the Baptist was a prophet straight out of the Old Testament, preparing the way for the Messiah with a radical call to repentance.\n\nWhen Jesus came to be baptized, John protested: 'I need to be baptized by you!' But Jesus insisted. As John baptized Him, heaven opened, the Spirit descended like a dove, and the Father's voice declared, 'This is my Son, whom I love.' John had fulfilled his purpose—pointing everyone to Jesus.\n\nBut John's boldness had consequences. He publicly condemned King Herod's adultery—Herod had married his brother's wife. Herodias, the unlawful wife, seethed with hatred. When Herod imprisoned John, she waited for her chance. At Herod's birthday party, her daughter danced so beautifully that Herod promised her anything. Prompted by her mother, she asked for John's head on a platter.\n\nJohn died in a dungeon, beheaded for speaking truth. But Jesus called him the greatest man born of woman. John understood what few do: 'He must increase, but I must decrease.' His entire life pointed away from himself to Jesus.",
    keyVerse: "He must become greater; I must become less.",
    keyVerseReference: "John 3:30",
    legacy: "John the Baptist prepared Israel for the Messiah and exemplified humble service to God's greater purpose."
  },
  {
    id: 30,
    name: "Nehemiah",
    title: "The Rebuilding Governor",
    type: "hero",
    story: "Nehemiah served as cupbearer to the Persian king—a prestigious position of trust. But when he heard that Jerusalem's walls lay in ruins and its people lived in disgrace, he wept for days. The city of God was defenseless, and something in Nehemiah couldn't accept it.\n\nHe prayed, fasted, then took an enormous risk. Standing before the king, he let his sadness show. Kings didn't like sad servants—it suggested disrespect. But when the king asked what he wanted, Nehemiah shot up a silent prayer and boldly asked to rebuild Jerusalem's walls.\n\nMiraculously, the king agreed and provided letters of safe passage and materials. But arriving in Jerusalem, Nehemiah faced mockery from enemies, internal opposition, and threats of attack. His response? Organize the people to build with a tool in one hand and a weapon in the other. They worked with such focus that the wall was completed in just 52 days—a task that should have taken months.\n\nNehemiah refused bribes, exposed corruption, and led with integrity. When enemies tried to lure him into traps, he replied, 'I am doing a great work and cannot come down.' His unwavering focus on God's assignment rebuilt not just walls but a nation's hope.",
    keyVerse: "I am carrying on a great project and cannot go down. Why should the work stop while I leave it and go down to you?",
    keyVerseReference: "Nehemiah 6:3",
    legacy: "Nehemiah rebuilt Jerusalem's walls and restored the city, demonstrating faithful leadership in the face of opposition."
  },
  {
    id: 31,
    name: "Delilah",
    title: "The Seductive Betrayer",
    type: "villain",
    story: "The Philistine lords came to Delilah with an offer she couldn't refuse: 1,100 pieces of silver from each of them if she could discover the secret of Samson's strength. All she had to do was betray the man who loved her.\n\nDelilah went to work with calculated manipulation. 'Tell me the secret of your great strength,' she coaxed. Three times Samson lied—bind him with fresh bowstrings, new ropes, weave his hair into a loom. Three times Delilah betrayed him to the Philistines. Three times he broke free. Any reasonable person would have noticed the pattern of betrayal and left. But lust had blinded Samson.\n\nDelilah escalated her tactics: 'How can you say you love me when you won't confide in me?' She nagged him day after day until 'he was tired to death.' Finally, Samson revealed the truth—his hair. That night, as he slept on her lap, she called a man to shave his head. The Philistines seized him, and his strength was gone.\n\nDelilah collected her blood money—roughly $600,000 in today's value—while Samson was blinded, chained, and enslaved. She represents the danger of seductive evil, using intimacy as a weapon. Her name became synonymous with treacherous beauty and deadly manipulation.",
    keyVerse: "With such nagging she prodded him day after day until he was sick to death of it.",
    keyVerseReference: "Judges 16:16",
    legacy: "Delilah's betrayal of Samson for silver warns against manipulation disguised as love and the destructive power of greed."
  },
  {
    id: 32,
    name: "Absalom",
    title: "The Rebellious Son",
    type: "villain",
    story: "Absalom was beautiful—the most handsome man in Israel, with hair so magnificent that when it was cut once a year, it weighed five pounds. But his beauty masked a heart poisoned by revenge and ambition. When his half-brother Amnon raped his sister Tamar, David did nothing. Absalom seethed for two years, then murdered Amnon and fled.\n\nThree years later, David allowed Absalom to return but wouldn't see him. Another two years of exile in his own city. Absalom's resentment grew into cold calculation. He began standing at the city gate, intercepting people bringing disputes to the king. 'If only I were judge,' he'd say with false humility, 'everyone would receive justice.' He stole the hearts of Israel.\n\nAfter four years of manipulation, Absalom declared himself king and launched a coup. David fled Jerusalem weeping, barefoot and heartbroken. Absalom entered the palace and publicly slept with his father's concubines—the ultimate act of disrespect. Civil war erupted.\n\nThe final battle came in the forest. Riding his mule under an oak tree, Absalom's famous hair caught in the branches, leaving him dangling helplessly. David had ordered, 'Be gentle with the young man Absalom for my sake,' but Joab drove three javelins through his heart. David's grief shook the kingdom: 'O my son Absalom! My son, my son!' Absalom's rebellion destroyed him, his beauty unable to save him from the consequences of pride.",
    keyVerse: "O my son Absalom! My son, my son Absalom! If only I had died instead of you.",
    keyVerseReference: "2 Samuel 18:33",
    legacy: "Absalom's rebellion against his father David ended in tragedy, warning of the destructive nature of pride and unforgiveness."
  },
  {
    id: 33,
    name: "Korah",
    title: "The Proud Rebel",
    type: "villain",
    story: "Korah was a Levite—chosen by God to serve in the tabernacle, an honor most Israelites could only dream of. But it wasn't enough. He looked at Moses and Aaron and thought, 'Why should they have all the authority?' His pride convinced him he deserved more.\n\nKorah gathered 250 leaders of Israel and confronted Moses: 'You have gone too far! The whole community is holy, every one of them, and the Lord is with them. Why then do you set yourselves above the Lord's assembly?' It sounded democratic and spiritual, but it was rebellion against God's appointed order.\n\nMoses fell on his face before the Lord, then issued a challenge: 'In the morning the Lord will show who belongs to him and who is holy.' He told Korah and his followers to bring censers and burn incense before the Lord. Let God decide who He had chosen.\n\nThe next morning, as Korah's rebels stood at the tabernacle, the earth split open beneath them. The ground swallowed Korah, his family, and all his possessions alive. They went down into the grave screaming while all Israel fled in terror. Then fire from the Lord consumed the 250 men offering incense. Korah's pride didn't just cost him his position—it cost him everything, becoming a permanent warning against rebelling against God's authority.",
    keyVerse: "You have gone too far! The whole assembly is holy, every one of them, and the Lord is with them. Why then do you set yourselves above the Lord's assembly?",
    keyVerseReference: "Numbers 16:3",
    legacy: "Korah's rebellion was swallowed by the earth, demonstrating that challenging God's appointed authority leads to destruction."
  },
  {
    id: 34,
    name: "Nebuchadnezzar",
    title: "The Humbled Tyrant",
    type: "villain",
    story: "He was the most powerful man on earth—king of Babylon, conqueror of nations, builder of wonders. Nebuchadnezzar ruled an empire that stretched from the Persian Gulf to the Mediterranean. He built the Hanging Gardens, one of the Seven Wonders of the Ancient World. His pride knew no limits.\n\nGod sent him a dream: a great tree that reached to heaven, providing shelter and food for all. Then a messenger from heaven commanded the tree be cut down, and the king would 'be driven away from people and live with the wild animals' for seven years. Daniel interpreted the dream and warned Nebuchadnezzar to renounce his sins and turn from wickedness. The king ignored him.\n\nOne year later, walking on the roof of his palace, Nebuchadnezzar looked out at Babylon and declared, 'Is not this the great Babylon I have built as the royal residence, by my mighty power and for the glory of my majesty?' Before the words left his mouth, judgment fell. His sanity was stripped away. He was driven from his throne, ate grass like cattle, his hair grew like eagle feathers, and his nails like bird claws.\n\nSeven years later, Nebuchadnezzar looked up to heaven, and his sanity returned. He praised God and acknowledged, 'Those who walk in pride he is able to humble.' The mightiest king on earth learned that all human power is temporary, and only God reigns forever.",
    keyVerse: "Those who walk in pride he is able to humble.",
    keyVerseReference: "Daniel 4:37",
    legacy: "Nebuchadnezzar's humiliation and restoration demonstrate that God opposes the proud but shows mercy to those who humble themselves."
  },
  {
    id: 35,
    name: "Balaam",
    title: "The Prophet for Hire",
    type: "villain",
    story: "Balaam was a genuine prophet—God spoke to him, and his prophecies came true. But his gift became corrupted by greed. When King Balak of Moab offered him wealth to curse Israel, Balaam should have immediately refused. Instead, he asked God for permission, hoping for a different answer.\n\nGod told him not to go. But when Balak sent more distinguished princes with promises of greater honor, Balaam asked God again. This time God said, 'Go, but speak only what I tell you.' Balaam saddled his donkey, his heart set on the reward. God was angry at his mercenary attitude.\n\nOn the way, an angel blocked the path with a drawn sword. Balaam couldn't see it, but his donkey could. Three times the donkey turned aside to save his life. Three times Balaam beat her. Then God opened the donkey's mouth: 'What have I done to deserve this?' The absurdity of arguing with a donkey didn't register—Balaam was too angry. Then his eyes opened, and he saw the angel who would have killed him.\n\nBalaam proceeded to Balak and tried to curse Israel—but every time he opened his mouth, blessings came out instead. Yet later, he advised Balak how to make Israel sin through sexual immorality and idolatry. Balaam died in battle, killed by the very people he tried to curse. His legacy? A prophet who knew God but loved money more.",
    keyVerse: "They have left the straight way and wandered off to follow the way of Balaam son of Bezer, who loved the wages of wickedness.",
    keyVerseReference: "2 Peter 2:15",
    legacy: "Balaam's greed corrupted his prophetic gift, and his name became synonymous with religious leaders who exploit faith for profit."
  },
  {
    id: 36,
    name: "Manasseh",
    title: "The Repentant King",
    type: "villain",
    story: "Manasseh inherited the throne of Judah at age 12 and reigned 55 years—the longest reign of any king in Judah. But he was also the worst. He rebuilt the pagan altars his father Hezekiah had torn down, practiced sorcery and witchcraft, consulted mediums, and even sacrificed his own sons in fire. He placed carved idols in God's temple. Scripture says 'Manasseh led Judah and the people of Jerusalem astray, so that they did more evil than the nations the Lord had destroyed.'\n\nGod sent prophets warning of judgment, but Manasseh ignored them. He shed so much innocent blood that he 'filled Jerusalem from end to end.' The righteous were slaughtered. Tradition says he had the prophet Isaiah sawn in half. His evil was so great that even his later repentance couldn't stop Judah's eventual exile.\n\nThen the king of Assyria invaded, captured Manasseh, put a hook in his nose, bound him in bronze shackles, and took him to Babylon. Humiliated and imprisoned, Manasseh finally humbled himself before God 'and prayed to him.' God heard his prayer, had compassion on him, and brought him back to Jerusalem.\n\nManasseh spent his remaining years trying to undo the damage—removing foreign gods, restoring the Lord's altar, commanding Judah to serve the God of Israel. But the rot had gone too deep. His story is both a warning about the far-reaching consequences of evil leadership and a testament that even the worst sinner can find forgiveness if they truly repent.",
    keyVerse: "In his distress he sought the favor of the Lord his God and humbled himself greatly before the God of his ancestors.",
    keyVerseReference: "2 Chronicles 33:12",
    legacy: "Manasseh's reign of evil led Judah to exile, but his late repentance shows that God's mercy extends even to the worst offenders."
  },
  {
    id: 37,
    name: "Caleb",
    title: "The Faithful Spy",
    type: "hero",
    story: "Twelve spies entered the Promised Land to scout for Israel. All twelve saw the same things—fortified cities, giant warriors, abundant fruit. But ten spies saw obstacles. Only two—Joshua and Caleb—saw opportunity. 'We should go up and take possession of the land, for we can certainly do it,' Caleb declared.\n\nThe majority won. The ten fearful spies convinced Israel to reject God's promise, and an entire generation was sentenced to wander the desert for 40 years until they died. But God made an exception: 'My servant Caleb has a different spirit and follows me wholeheartedly. I will bring him into the land.'\n\nForty-five years later, at age 85, Caleb was ready to claim his inheritance. Did he ask for easy territory? No. 'Give me this hill country,' he said—the land where giants still lived. His faith hadn't diminished with age. He drove out the giants and possessed his inheritance.\n\nCaleb's legacy isn't just about courage in the face of giants. It's about wholehearted devotion that lasts a lifetime. While others complained, compromised, and died in the wilderness, Caleb kept believing. His faith at 85 was as fierce as it was at 40. He proves that faithfulness isn't about a moment—it's about a life.",
    keyVerse: "But my servant Caleb has a different spirit and follows me wholeheartedly.",
    keyVerseReference: "Numbers 14:24",
    legacy: "Caleb's unwavering faith earned him an inheritance in the Promised Land, and at 85 he still had the courage to fight giants."
  },
  {
    id: 38,
    name: "Lydia",
    title: "The First European Convert",
    type: "hero",
    story: "She was a businesswoman in a man's world—a dealer in purple cloth, the luxury fabric of royalty and wealth. Lydia had made a name for herself in Philippi, but something was missing. She was a God-fearer, a Gentile who worshiped the God of Israel, gathering by the river for prayer because there was no synagogue in the city.\n\nOne Sabbath, Paul arrived and began teaching. Lydia listened as Paul explained how Jesus fulfilled every prophecy, how the Messiah had died and risen. 'The Lord opened her heart to respond to Paul's message.' It was simple, beautiful conversion—her heart opened, she believed, and immediately she and her household were baptized.\n\nBut Lydia's faith wasn't passive. She opened her home to Paul and his companions. 'If you consider me a believer in the Lord, come and stay at my house.' Her home became the base for the Philippian church—the first church in Europe. When Paul and Silas were beaten and imprisoned, then miraculously freed, they returned to Lydia's house.\n\nLydia was Europe's first Christian convert. She used her wealth, influence, and home to advance the gospel. No great speeches recorded, no miracles performed—just a woman whose open heart led to an open home, changing the spiritual landscape of an entire continent.",
    keyVerse: "The Lord opened her heart to respond to Paul's message.",
    keyVerseReference: "Acts 16:14",
    legacy: "Lydia became the first Christian convert in Europe, and her home became the foundation of the church in Philippi."
  },
  {
    id: 39,
    name: "Barnabas",
    title: "The Encourager",
    type: "hero",
    story: "His real name was Joseph, but the apostles nicknamed him Barnabas—'Son of Encouragement.' It was the perfect description. When the early church needed funds, Barnabas sold his field and laid the money at the apostles' feet. But his greatest gift wasn't his generosity—it was his ability to see potential where others saw problems.\n\nWhen Saul converted from persecutor to preacher, everyone was terrified of him. 'Isn't he the one who raised havoc in Jerusalem?' They thought it was a trap. But Barnabas took the risk. He brought Saul to the apostles, vouched for his conversion, and opened the door for Paul's ministry. Without Barnabas's courage, we might never have had Paul's letters.\n\nYears later, when John Mark abandoned their missionary journey, Paul refused to give him a second chance. Barnabas disagreed. He believed in restoration, believed Mark could change. They split over it—Barnabas took Mark, Paul took Silas. It seemed like a failure. But Barnabas was right. Mark matured, eventually writing the Gospel of Mark and earning even Paul's praise: 'He is helpful to me in my ministry.'\n\nBarnabas teaches that encouragement changes lives. He saw potential in Paul when others saw danger. He saw redemption in Mark when others saw failure. His legacy reminds us that sometimes believing in people is the most powerful ministry.",
    keyVerse: "He was a good man, full of the Holy Spirit and faith, and a great number of people were brought to the Lord.",
    keyVerseReference: "Acts 11:24",
    legacy: "Barnabas mentored Paul and restored John Mark, demonstrating that encouragement and second chances can change the course of ministry."
  },
  {
    id: 40,
    name: "Timothy",
    title: "The Young Protégé",
    type: "hero",
    story: "He was young—probably in his late teens or early twenties when Paul chose him as a ministry partner. Timothy was the son of a Jewish mother and Greek father, raised in the Scriptures from childhood by his mother Eunice and grandmother Lois. When Paul arrived in Lystra, the church spoke well of Timothy, and Paul saw something special.\n\nBut Timothy wasn't naturally bold. He struggled with fear, had stomach problems, and people looked down on him because of his youth. Paul had to constantly encourage him: 'Don't let anyone look down on you because you are young.' 'God has not given us a spirit of fear, but of power, love, and self-discipline.' 'Fan into flame the gift of God within you.'\n\nDespite his fears, Timothy stepped up. He traveled with Paul on dangerous missionary journeys, was sent to troubled churches to bring correction and encouragement, and eventually led the church in Ephesus. Paul trusted him with some of his most difficult assignments, calling him 'my true son in the faith.'\n\nTimothy's story is for everyone who feels inadequate. He was young, timid, and struggling with his health. But he was faithful. Paul's two letters to Timothy became Scripture, guiding church leaders for 2,000 years. Timothy proves that God doesn't need our perfection or confidence—just our faithfulness.",
    keyVerse: "Don't let anyone look down on you because you are young, but set an example for the believers in speech, in conduct, in love, in faith and in purity.",
    keyVerseReference: "1 Timothy 4:12",
    legacy: "Timothy overcame his youth and timidity to lead the church in Ephesus, showing that faithful service matters more than natural confidence."
  },
  {
    id: 41,
    name: "Josiah",
    title: "The Boy King Who Sought God",
    type: "hero",
    story: "He became king at eight years old—a child thrust into ruling a nation that had abandoned God. His father was assassinated, his grandfather was the wickedest king in Judah's history. Everything around young Josiah pointed toward continuing the cycle of idolatry and rebellion. But at sixteen, 'he began to seek the God of his father David.'\n\nAt twenty, Josiah started tearing down the pagan altars, smashing the idols, destroying the high places where false gods were worshiped. Then at twenty-six, during temple repairs, the high priest found something shocking: the Book of the Law. God's Word had been lost, forgotten for generations. When it was read to Josiah, he tore his robes in grief.\n\n'Great is the Lord's anger that burns against us because our fathers have not kept the word of the Lord,' he cried. Josiah gathered all Judah and read the entire Law to them. He led the nation in renewing their covenant with God. He celebrated Passover with a passion not seen since the days of the judges. He personally led the spiritual reformation.\n\nJosiah died young in battle at 39, but his impact was profound. He proved that age is no barrier to wholehearted devotion. A child can seek God. A teenager can lead reform. A young king can change a nation's destiny.",
    keyVerse: "Neither before nor after Josiah was there a king like him who turned to the Lord as he did—with all his heart and with all his soul and with all his strength.",
    keyVerseReference: "2 Kings 23:25",
    legacy: "Josiah led Judah's greatest spiritual reformation, rediscovering God's Word and proving that youthful devotion can transform nations."
  },
  {
    id: 42,
    name: "Shadrach, Meshach & Abednego",
    title: "The Faithful Three",
    type: "hero",
    story: "They were teenagers when Babylon conquered Jerusalem—young nobles torn from their homes, given Babylonian names, trained in Babylonian wisdom. Everything was designed to make them forget their God. But Daniel and his three friends refused to compromise. When ordered to eat the king's food, they asked for vegetables instead and thrived.\n\nYears later, King Nebuchadnezzar built a golden statue ninety feet tall and commanded everyone to bow and worship it. The entire empire fell prostrate at the sound of the music. Except for three young Jewish men. Shadrach, Meshach, and Abednego stood alone while thousands bowed.\n\nRage consumed the king. 'If you don't worship my god, I'll throw you into a blazing furnace! Then what god will rescue you?' Their response became legendary: 'The God we serve is able to deliver us. But even if he does not, we want you to know that we will not serve your gods or worship your statue.' Even if He doesn't—those four words defined faith.\n\nThe furnace was heated seven times hotter. They were thrown in fully clothed, bound hand and foot. The soldiers who threw them in were killed by the flames. But inside the furnace, the king saw four men walking unbound—and the fourth looked like 'a son of the gods.' When they emerged, not even the smell of smoke clung to them. Faith that refuses to bow will never burn.",
    keyVerse: "But even if he does not, we want you to know, Your Majesty, that we will not serve your gods or worship the image of gold you have set up.",
    keyVerseReference: "Daniel 3:18",
    legacy: "The three young men survived the fiery furnace, demonstrating that faithfulness to God is worth any cost."
  },
  {
    id: 43,
    name: "Athaliah",
    title: "The Murderous Queen",
    type: "villain",
    story: "She was daughter of Jezebel, wife of a king, mother of a king—and more bloodthirsty than them all. When her son King Ahaziah died, most mothers would grieve. Athaliah saw opportunity. She murdered her own grandchildren—every royal heir she could find—and seized the throne of Judah for herself.\n\nFor six years, this daughter of Baal worshipers ruled God's people. She promoted idolatry, defiled the temple, and nearly extinguished David's royal line. But what Athaliah didn't know was that one infant grandson, Joash, had been rescued by his aunt and hidden in the temple for six years. The daughter of a high priest raised him in secret while Athaliah reigned in blood.\n\nWhen Joash turned seven, the priest Jehoiada staged a careful coup. On a Sabbath, when Athaliah wouldn't expect trouble, he brought out the boy king and crowned him. The people erupted in joy: 'Long live the king!' Athaliah heard the celebration, rushed to the temple, and saw her worst nightmare—a grandson she thought was dead, wearing her stolen crown.\n\n'Treason! Treason!' she screamed. But her power was broken. They led her out of the temple and executed her. Athaliah's murderous ambition couldn't stop God's promise that a descendant of David would always reign. Evil often thinks it has won—right before God's plan unfolds.",
    keyVerse: "When Athaliah the mother of Ahaziah saw that her son was dead, she proceeded to destroy the whole royal family.",
    keyVerseReference: "2 Kings 11:1",
    legacy: "Athaliah's massacre of her own grandchildren failed to destroy David's line, and her reign of terror ended with her execution."
  },
  {
    id: 44,
    name: "Herodias",
    title: "The Vengeful Adulteress",
    type: "villain",
    story: "She married her uncle, Herod Philip. Then she left him for his brother, Herod Antipas—who was also her uncle and also already married. It was adultery, incest, and scandal rolled into one. Most people either ignored it or quietly gossiped. But John the Baptist publicly condemned it: 'It is not lawful for you to have your brother's wife.'\n\nHerodias seethed with hatred. She wanted John dead, but Herod was afraid—he knew John was a righteous man, and the people considered him a prophet. So John sat in prison, alive but silenced. Herodias waited for her chance.\n\nIt came at Herod's birthday banquet. Herodias's daughter Salome danced so beautifully that Herod drunkenly promised her anything, up to half his kingdom. The girl ran to her mother: 'What should I ask for?' Herodias saw her moment: 'The head of John the Baptist.' Not his release, not his exile—his head. On a platter. Immediately.\n\nHerod was distressed but trapped by his public oath. The executioner brought John's head on a platter, and Herodias had her revenge. But her vindictive cruelty accomplished nothing. John's death only amplified his message. His disciples buried his body and went to tell Jesus. The voice crying in the wilderness couldn't be silenced by a platter—his message still echoes 2,000 years later.",
    keyVerse: "So she said, 'The head of John the Baptist.'",
    keyVerseReference: "Mark 6:24",
    legacy: "Herodias's vengeful murder of John the Baptist exemplifies how pride and rage lead to irreversible evil."
  },
  {
    id: 45,
    name: "Demas",
    title: "The Deserter",
    type: "villain",
    story: "He was Paul's co-worker, mentioned alongside Luke and others as a faithful companion. Demas traveled with Paul, shared in the ministry, was trusted with spreading the gospel. His name appears in letters to the Colossians and to Philemon—evidence that he was once part of the inner circle of early Christianity's greatest missionary.\n\nBut something changed. While Paul was imprisoned in Rome, facing execution, he wrote to Timothy with devastating brevity: 'Demas, because he loved this world, has deserted me and has gone to Thessalonica.' No dramatic fall into obvious sin. No theological controversy. Just 'loved this world.'\n\nWhat did that mean? Perhaps the comforts Thessalonica offered seemed better than suffering in Rome. Perhaps watching Paul face martyrdom made Demas reconsider the cost of following Jesus. Perhaps the daily grind of faith without immediate reward wore him down. Whatever the reason, when the pressure came, Demas walked away.\n\nDemas represents the silent tragedy of promising believers who fade away. Not with scandal or apostasy, but with a quiet drift toward comfort, security, and the lure of this world. His warning echoes through history: You can walk with giants of faith, serve faithfully for years, and still abandon the race if you love this world more than the next.",
    keyVerse: "Demas, because he loved this world, has deserted me and has gone to Thessalonica.",
    keyVerseReference: "2 Timothy 4:10",
    legacy: "Demas's desertion warns that even faithful co-workers can abandon the faith when they love the world more than Christ."
  },
  {
    id: 46,
    name: "Simon the Sorcerer",
    title: "The False Believer",
    type: "villain",
    story: "Simon was the big name in Samaria—a sorcerer who amazed crowds with magical powers. People called him 'the Great Power of God.' He loved the attention, the awe, the influence. Then Philip arrived preaching Jesus, performing genuine miracles, and suddenly Simon's magic show looked cheap. The crowds followed Philip instead.\n\nSo Simon did what seemed pragmatic: he believed and was baptized. He followed Philip around, amazed by the miracles. On the surface, he looked like a convert. But when Peter and John arrived and laid hands on people to receive the Holy Spirit, Simon's true heart was exposed.\n\n'Give me also this ability,' Simon demanded, pulling out money. 'I want to be able to lay hands on people so they receive the Holy Spirit too.' He thought spiritual power was for sale, something to enhance his reputation and control.\n\nPeter's response was scorching: 'May your money perish with you, because you thought you could buy the gift of God with money! You have no part in this ministry, because your heart is not right before God. Repent of this wickedness!' Simon wanted the power of God to serve Simon's purposes—an ancient error that still infects the church today. His name became the root of 'simony'—buying or selling spiritual positions and gifts.",
    keyVerse: "May your money perish with you, because you thought you could buy the gift of God with money!",
    keyVerseReference: "Acts 8:20",
    legacy: "Simon the Sorcerer's attempt to buy spiritual power gave rise to the term 'simony' and warns against treating faith as a transaction."
  },
  {
    id: 47,
    name: "Achan",
    title: "The Secret Sinner",
    type: "villain",
    story: "Israel had just witnessed a miracle—the walls of Jericho collapsed after they marched and shouted. God gave them the city, but with one clear command: everything in Jericho was devoted to destruction or to God's treasury. Take nothing for yourself. It was a test of obedience. Achan failed.\n\nHe saw a beautiful Babylonian robe, two hundred shekels of silver, and a bar of gold. 'I coveted them and took them,' he later confessed. He buried his theft under his tent, thinking no one would know. But then Israel attacked the small town of Ai and suffered a humiliating defeat. Thirty-six men died. Joshua fell on his face: 'Why, Lord?'\n\nGod's answer was devastating: 'Israel has sinned. They have taken devoted things. They have stolen and lied and put them with their own possessions.' One man's secret sin had brought defeat to an entire nation. Through lots, God revealed Achan tribe by tribe, clan by clan, family by family, until Achan himself was exposed.\n\nWhen confronted, Achan confessed. But confession couldn't undo the consequences. He and his whole family were stoned to death in the Valley of Achor—'Valley of Trouble.' His story is a sobering reminder: hidden sin is never truly hidden from God, and individual disobedience can have corporate consequences.",
    keyVerse: "Israel has sinned; they have violated my covenant, which I commanded them to keep.",
    keyVerseReference: "Joshua 7:11",
    legacy: "Achan's theft brought defeat to Israel, demonstrating that secret sin affects entire communities and God always exposes hidden disobedience."
  },
  {
    id: 48,
    name: "Rahab",
    title: "The Redeemed Prostitute",
    type: "hero",
    story: "She was the last person you'd expect to be a hero—a prostitute in Jericho, a Canaanite by birth, living in a house built into the city walls. When two Israelite spies entered Jericho to scout before the invasion, they ended up at Rahab's house. It should have been their death sentence.\n\nThe king's men came hunting for the spies. Rahab could have turned them in, earned a reward, maybe gained respectability. Instead, she hid them under stalks of flax on her roof and lied to the soldiers. Why? Because she had heard what God did—how He dried up the Red Sea, how He gave Israel victory after victory. 'I know that the Lord has given you this land,' she told the spies. 'The Lord your God is God in heaven above and on the earth below.'\n\nRahab made a deal: save my family when Jericho falls. The spies agreed. When the walls collapsed, her house stood intact. Rahab and her family were spared, brought into Israel, and absorbed into God's people. But the story doesn't end there. She married an Israelite named Salmon and became the mother of Boaz—which made her the great-great-grandmother of King David and an ancestor of Jesus Christ.\n\nA Canaanite prostitute in the genealogy of the Messiah. Rahab's story screams grace: your past doesn't determine your future, and faith—not perfection—is what God honors.",
    keyVerse: "By faith the prostitute Rahab, because she welcomed the spies, was not killed with those who were disobedient.",
    keyVerseReference: "Hebrews 11:31",
    legacy: "Rahab's faith saved her family and placed her in the lineage of Christ, proving that God's grace redeems the unlikeliest people."
  }
];

