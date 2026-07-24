export interface Chapter {
  title: string;
  content: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  cover: string;
  description: string;
  chapters: Chapter[];
}

export const books: Book[] = [
  {
    id: "gita",
    title: "The Bhagavad Gita",
    author: "Vyasa",
    genre: "Hinduism",
    cover: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=800",
    description: "A 700-verse Hindu scripture that is part of the epic Mahabharata, addressing moral and philosophical dilemmas through a dialogue between Prince Arjuna and Lord Krishna.",
    chapters: [
      {
        title: "Chapter 2: The Song of Wisdom",
        content: `Sanjaya said: To him who was thus overwhelmed with compassion and despairing, and whose eyes were filled with tears, Madhava (Krishna) spoke these words.

The Supreme Lord said: My dear Arjuna, how has this delusion overtaken you in this critical hour? This is not befitting an honorable person. It does not lead to heaven and causes only disgrace.

O son of Prtha, do not yield to this unmanliness. Give up this petty faint-heartedness and arise, O chastiser of enemies.

Arjuna asked: O Madhusudana, how can I fight with arrows in battle against men like Bhishma and Drona, who are worthy of my worship?

Sanjaya said: Having spoken thus, Arjuna, the chastiser of enemies, cast aside his bow and arrow and sat down on the chariot, his mind overwhelmed with grief.

The Supreme Lord said: You have spoken words of wisdom, but you grieve for those who need not be grieved for. The wise neither laments for the dead nor for the living.

For the soul there is neither birth nor death at any time. It is unborn, eternal, ever-existing, and primeval. It is not slain when the body is slain.

As a person puts on new garments, giving up old ones, the soul similarly accepts new material bodies, giving up the old and useless ones.

The soul can never be cut into pieces by any weapon, nor can it be burned by fire, nor moistened by water, nor dried by the wind.

These material bodies are perishable, but the eternal soul within them is indestructible, immeasurable, and eternal. Therefore, O Arjuna, fight the battle of life.

You have the right to perform your prescribed duty, but you are not entitled to the fruits of action. Never consider yourself the cause of the results of your activities, and never be attached to inaction.`
      },
      {
        title: "Chapter 6: The Practice of Meditation",
        content: `The Supreme Lord said: One who is unattached to the fruits of his work and who works as he is obligated is in the renounced order of life, and he is the true mystic, not he who lights no fire and performs no duty.

What is called renunciation is the same as yoga, or linking oneself with the Supreme. For one who has conquered the mind, the mind is the best of friends; but for one who has failed to do so, the mind will remain the greatest enemy.

For one who has conquered the mind, the mind is the best of friends. But for one who has not conquered the mind, the mind is the greatest enemy.

The soul is its own friend and its own enemy. For one who has conquered the mind, the mind is the best of friends. But for one who has failed to do so, the mind is the greatest enemy.

A true yogi observes Me in all things and sees everything within Me. The self-realized person sees Me everywhere.

For one who sees Me everywhere and sees everything in Me, I am never lost, nor is that person ever lost to Me.

The yogi who is established in union with the Supreme is likened to a lamp in a windless place, which does not waver.

When the mind, subdued by constant practice, becomes steady and still, and when the self is完全controlled, finding satisfaction in the Self alone, then one is said to be truly united.

There is no possibility of one's becoming a yogi if one eats too much or eats too little, sleeps too much or sleeps too little.

For one whose mind is uncontrolled, the yoga process is like trying to tame the wind. But for one whose mind is subdued and who is united with the Self through yoga, the process is like stilling the waves upon the ocean.

The person who is temperate in eating, sleeping, working, and recreation will be able to practice yoga, which mitigates all material pains.`
      },
      {
        title: "Chapter 12: Devotion to the Supreme",
        content: `Arjuna asked: Those who worship You with devotion, and those who worship the impersonal Brahman, which of them are better versed in yoga?

The Supreme Lord said: Both who worship Me with devotion and who worship the impersonal Brahman attain Me. But of these, the one who worships Me with devotion is closer to Me.

The devotees who worship Me with undivided devotion, their minds fixed on Me, are considered the best. They are the most advanced yogis.

But those who worship the formless, imperceptible, unmanifested, omnipresent, inconceivable, unborn, and immovable, controlling all the senses and equally disposed to everyone, such persons also make progress.

For those whose minds are fixed on Me, who worship Me with exclusive devotion, and who always meditate on Me with faith, I am quickly responsive.

O son of Prtha, surrender unto Me utterly. By My grace you will attain supreme peace and reach My eternal abode.

Therefore, place your mind on Me, devote yourself to Me, sacrifice to Me, bow down to Me. Thus united with Me and fixing your mind on Me, you will attain the Supreme Goal.

If you are unable to fix your mind steadily on Me, then practice yoga to reach Me. If you cannot practice yoga, then engage in devotional service. If you cannot engage in devotional service, then perform your work for My sake. Even action performed for My sake is better than inaction.

If you cannot do any of these, then simply surrender unto Me. Give up all varieties of dharma and simply surrender unto Me alone. I shall deliver you from all sinful reactions; do not fear.

Be alike to friend and enemy, the same in honor and disgrace, in heat and cold, in pleasure and pain. Equally disposed toward all, such a person is dear to Me.

Those who are always free from malice toward all beings,友好 and compassionate, free from egoism, self-controlled, and ever equal in pleasure and pain, such devotees are dear to Me.

Those who neither rejoice nor hate, neither grieve nor desire, who have renounced both good and evil, such devotees are dear to Me.

Those who are free from pretension and illusion, who have conquered the dualities of existence, who are fixed in Me, and who are without envy, such devotees are dear to Me.

The devotees who regard nothing as superior or inferior to Me, who love Me alone, and who are devoted to Me in every way, they are very dear to Me.`
      }
    ]
  },
  {
    id: "upanishads",
    title: "The Upanishads",
    author: "Various Sages",
    genre: "Hinduism",
    cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800",
    description: "Ancient Sanskrit texts containing some of the central philosophical concepts of Hinduism, exploring the nature of reality, the self, and the ultimate truth.",
    chapters: [
      {
        title: "Isha Upanishad",
        content: `All this, whatever moves in this moving world, is enveloped by God. Therefore find your delight in the spirit; do not covet the wealth of anyone.

Even if you live to be a hundred years, only this work is yours: do not covet the wealth of others. There is no other path.

The Self is everywhere, bright, bodiless, without wounds, pure, untouched by sin, wise, impenetrable, constant, beyond thought, subtle, inexhaustible.

The Self cannot be attained by the weak. Those who know the Self are born in luminous worlds.

The Self moves and does not move. It is far and it is near. It is within all this and it is also outside all this.

He who sees all beings in the Self, and the Self in all beings, hates no one.

When a person knows the Self as "I am this," then what could one desire or seek? When one has known the Self, what would one wish to know?

The wise, who sees the Self in all beings and all beings in the Self, sees the same everywhere. There is no delusion or grief for one who sees unity.

Where one sees nothing else, hears nothing else, understands nothing else, that is the Infinite. Where one sees something else, hears something else, understands something else, that is the small. The Infinite is immortal, the small is mortal.

The Self is the host of everything, the universe is the Self. He who knows the Self as the enjoyer of sacrifice and austerity, as the lord of all, as the witness of all, as the support of all, he sees the Self in all things.

The Self is the fire, the sun, the wind, and the moon. The Self is all this, the clouds, and the earth. The Self is everything that exists and everything that does not exist.`
      },
      {
        title: "Katha Upanishad",
        content: `Death said: The good is one thing, the pleasant is another. These two have different objects. He who chooses the good obtains perfection; he who chooses the pleasant loses the goal.

The good and the pleasant approach a person. The wise, considering the difference between them, discriminates. The wise prefer the good to the pleasant, but the foolish choose the pleasant for the sake of wealth.

You have indeed turned away from the wise and have chosen the way of the ignorant. Therefore, O Nachiketas, you who seek the way to immortality, I hold you to be wise.

The Self is not born, nor does it die. It did not spring from anything, and nothing sprang from it. Unborn, eternal, everlasting, ancient, it is not slain when the body is slain.

Smaller than the smallest, greater than the greatest, the Self is hidden in the heart of every creature. A person who is free from desire beholds the majesty of the Self through tranquility of the senses and mind and becomes free from sorrow.

The Self cannot be known by study of the scriptures, nor by subtlety of intellect, nor by much learning. But by him who longs for it, it is known. To him the Self reveals its own nature.

This Self cannot be attained by instruction, nor by intellectual power, nor even through much hearing. It is attained only by the one whom the Self chooses. To such a one the Self reveals its own nature.

The wise, who hears and reflects on the words of the Upanishads, and who has attained knowledge of the Self, rejoices in the Self. Having renounced the world, he desires to live in freedom.

I know that this imperishable Self is like a lamp, which removes all fear of death. This is the bridge to immortality.

In the space within the heart lies the Self, the controller of the vital energies, the lord of all, the ruler of all. He who knows this obtains all worlds and all desires.

The Self is the ruler of all, the lord of all. He who knows the Self does not tremble. He who knows the Self, seeing, hearing, reflecting, knowing, attains all things.`
      }
    ]
  },
  {
    id: "dhammapada",
    title: "The Dhammapada",
    author: "Gautama Buddha",
    genre: "Buddhism",
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800",
    description: "A collection of sayings of the Buddha in verse form and one of the most widely read and best known Buddhist scriptures, covering ethics, mental discipline, and wisdom.",
    chapters: [
      {
        title: "Chapter 1: Pairs (Yamaka)",
        content: `Mind is the forerunner of all actions. All deeds are led by mind, created by mind. If one speaks or acts with a corrupt mind, suffering follows, as the wheel follows the hoof of the ox.

Mind is the forerunner of all actions. All deeds are led by mind, created by mind. If one speaks or acts with a serene mind, happiness follows, as a shadow that never departs.

We are what we think. All that we are arises with our thoughts. With our thoughts, we make the world. Speak or act with an impure mind, and trouble will follow you as the wheel follows the hoof of the ox.

Speak or act with a pure mind, and happiness will follow you as a shadow, always near.

"He abused me, he struck me, he defeated me, he robbed me." Those who harbor such thoughts do not still their hatred.

"He abused me, he struck me, he defeated me, he robbed me." Those who do not harbor such thoughts still their hatred.

Hatred is never appeased by hatred in this world. By non-hatred alone is hatred appeased. This is an eternal law.

Do not look for faults in others, or look for what they have done or not done. Look rather for what you yourself have done or not done.

All those who wake up and are mindful, and who strive day and night in the Dhamma, their fetters grow less.

As a river rushes headlong to the ocean, so does the mind of a noble person rush to the calm state of the mind.

Whatever an enemy may do to an enemy, or a hater to a hater, a wrongly directed mind will do greater harm.

Neither a mother nor a father can do as much for their child as a well-directed mind can do for the person who is wise.`
      },
      {
        title: "Chapter 3: The Mind (Citta)",
        content: `The mind is hard to restrain, swift, it flies wherever it wishes. To tame the mind is the task of the wise person. A restrained mind brings happiness.

The mind is very hard to perceive, very subtle, it flies wherever it wishes. The wise person should guard the mind. A guarded mind brings happiness.

Whatever an enemy may do to an enemy, or a hater to a hater, a wrongly directed mind will do greater harm.

Neither a mother nor a father can do as much for their child as a well-directed mind can do for the person who is wise.

Those who have confidence in a mind that is well-controlled, who are established in the Dhamma, and who are wise, their merit grows.

As a bather sprinkling water on a clean lotus, so does a wise person remove the defilements as the wind removes dust from a leaf.

Whatever a hater may do to a hater, or an enemy to an enemy, a wrongly directed mind will do greater harm.

It is easy to see the faults of others, but difficult to see one's own faults. One sees the faults of others as chaff, but conceals one's own faults as a cunning gambler conceals his dice.

If a person holds himself dear, let him protect himself well. During each of the three watches of the night, the wise person should remain watchful.

The mind is the chief factor in making a person. What a person thinks, that they become. If their mind is impure, they speak and act from impurity, and suffering follows.

If a person's mind is pure, they speak and act from purity, and happiness follows like a shadow that never departs.

The mind is hard to restrain, swift and restless, it flies wherever it wishes. To tame the mind is the task of the wise. A well-tamed mind brings happiness.`
      },
      {
        title: "Chapter 20: The Path (Magga)",
        content: `The best of paths is the Eightfold Path. The best of truths is the Four Noble Truths. The best of states is non-attachment. The best of humans is the one who sees.

This is the only path for the purification of beings, for the removal of sorrow, for the abolition of suffering and grief, for gaining the true way, for the realization of Nirvana. This is the Noble Eightfold Path.

Right view, right intention, right speech, right action, right livelihood, right effort, right mindfulness, right concentration. This is the Noble Eightfold Path.

This is the only path. There is no other for the purification of vision. Follow this path and you will confuse Mara.

Following this path, you will make an end of suffering. Having followed this path that I have pointed out, you will free yourself from bondage.

This path is practiced by the sages who have entered the stream of the Dhamma. Those who follow this path are freed from suffering and bondage.

You yourselves must strive. The Buddhas only point the way. Those who practice meditation and follow the path are freed from the bonds of death.

"All conditioned things are impermanent." When one sees this with wisdom, one turns away from suffering.

"All conditioned things are suffering." When one sees this with wisdom, one turns away from suffering.

"All conditioned things are without self." When one sees this with wisdom, one turns away from suffering.

The mind that is well-trained in the seven factors of awakening and that delights in the destruction of craving is like a lotus that is untouched by water.

A person who has abandoned anger, is free from conceit, who has overcome all fetters, such a person does not sorrow.

If there is no attachment, there is no sorrow. Where there is no sorrow, there is peace. Where there is peace, there is happiness.

The greatest gift is patience. The greatest virtue is self-restraint. The best friend is the Dhamma. Nirvana is the greatest happiness.

The hungry person is always hungry. The noble one puts an end to hunger. All little faults are avoided when the great enemy, conceit, is destroyed.

The best of friends is one who gives what is difficult to give, and says what is difficult to say. One who makes sacrifices for another, that person is a true friend.`
      }
    ]
  },
  {
    id: "heart-sutra",
    title: "The Heart Sutra",
    author: "Nagarjuna",
    genre: "Buddhism",
    cover: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800",
    description: "The most well-known Mahayana Buddhist scripture, a concise expression of the Prajnaparamita teaching on emptiness and the nature of reality.",
    chapters: [
      {
        title: "The Heart of Perfect Wisdom",
        content: `Thus have I heard. At one time, the Blessed One was dwelling on Vulture Peak near Rajagriha with a great gathering of monks and a great gathering of bodhisattvas.

At that time, the Blessed One entered the Samadhi on the Manifestation of the Dharma that Dispels All Misery. At the same time, the noble Avalokiteshvara Bodhisattva the Great Being, while practicing the deep Prajnaparamita, clearly saw that the five skandhas are empty of inherent nature.

Through this insight, the noble Avalokiteshvara overcame all suffering. Then, through the inspiration of the Buddha, the noble Avalokiteshvara Bodhisattva the Great Being spoke thus to the venerable Shariputra:

"Shariputra, form is emptiness, emptiness is form. Form is not other than emptiness, emptiness is not other than form. In the same way, feeling, perception, formations, and consciousness are empty.

Shariputra, thus all dharmas are emptiness. They are not born, they do not arise, they do not cease, they are not pure, they are not impure, they neither increase nor decrease.

Therefore, in emptiness there is no form, no feeling, no perception, no formations, no consciousness, no eye, no ear, no nose, no tongue, no body, no mind, no form, no sound, no smell, no taste, no touch, no dharmas, no eye consciousness up to no mind consciousness, no ignorance and no extinction of ignorance up to no old age and death and no extinction of old age and death, no suffering, no origination, no path, no wisdom, no attainment.

Since there is no attainment, bodhisattvas rely on Prajnaparamita, and with no obscuration of mind they overcome fear. Far removed from the three worlds, they realize nirvana.

All Buddhas of the three times rely on Prajnaparamita and attain supreme enlightenment.

Therefore one should know that Prajnaparamita is the great mantra, the unsurpassed mantra, the mantra equal to the unequaled, the mantra that completely pacifies all suffering. It is true, not false. Therefore set forth the Prajnaparamita mantra, set forth the mantra that says:

Gate gate paragate parasamgate bodhi svaha.`
      }
    ]
  },
  {
    id: "tao",
    title: "Tao Te Ching",
    author: "Laozi",
    genre: "Taoism",
    cover: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800",
    description: "A fundamental text for both philosophical and religious Taoism, emphasizing living in harmony with the Tao, the fundamental nature of reality.",
    chapters: [
      {
        title: "Chapters 1-8: The Nature of the Tao",
        content: `Chapter 1: The Tao that can be told is not the eternal Tao. The name that can be named is not the eternal name. The nameless is the beginning of heaven and earth. The named is the mother of ten thousand things.

Chapter 2: When people see some things as beautiful, other things become ugly. When people see some things as good, other things become bad. Being and non-being create each other. Difficult and easy support each other. Long and short define each other. High and low depend on each other. Before and after follow each other.

Therefore the sage manages affairs without action and spreads teachings without words. The ten thousand things rise and fall without cease, but the sage does not begin them. He acts, but does not possess. He accomplishes, but does not claim credit.

Chapter 3: Not valuing the rare prevents people from stealing. Not displaying what is desired keeps the mind from confusion. Therefore the sage governs by emptying minds and strengthening resolve.

Chapter 4: The Tao is like an empty vessel that yet may be drawn from without ever needing to be filled. It is deep and fathomless, the ancestor of all things.

Chapter 5: Heaven and earth are impartial; they treat the ten thousand things as straw dogs. The sage is impartial; he treats the people as straw dogs.

Chapter 6: The spirit of the valley never dies. It is called the mysterious female. The gateway of the mysterious female is called the root of heaven and earth. Dimly visible, it seems as if it were there, yet use will never drain it.

Chapter 7: Heaven is eternal and earth endures. The reason why heaven and earth can be eternal and endure is that they do not live for themselves. Therefore they can live long.

Chapter 8: The highest goodness is like water. Water benefits the ten thousand things and does not compete with them. It dwells in places that others disdain. Therefore it is close to the Tao.`
      },
      {
        title: "Chapters 33-43: Wisdom and Humility",
        content: `Chapter 33: Knowing others is intelligence; knowing yourself is true wisdom. Mastering others is strength; mastering yourself is true power. If you realize that you have enough, you are truly rich.

Chapter 36: If you want to shrink something, you must first allow it to expand. If you want to get rid of something, you must first allow it to flourish. If you want to take something, you must first allow it to be given. This is called the subtle perception of the way things are.

The soft overcomes the hard. The slow overcomes the fast. Let your workings remain mysterious, just as nature works in silence, and thus the universe comes into being.

Chapter 37: The Tao never acts, yet nothing is left undone. If kings and lords could follow it, the ten thousand things would transform of their own accord.

Chapter 42: The Tao gives birth to One. One gives birth to Two. Two gives birth to Three. Three gives birth to the ten thousand things. The ten thousand things carry yin and embrace yang. They achieve harmony through the interaction of these forces.

Chapter 43: The softest thing in the universe overcomes the hardest. That which has no substance enters where there is no space. This is how I know the value of actionless action.

Teaching without words, working without action, few in the world can achieve this.`
      }
    ]
  },
  {
    id: "art-of-war",
    title: "The Art of War",
    author: "Sun Tzu",
    genre: "Taoism",
    cover: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=800",
    description: "An ancient Chinese military treatise that has become a profound guide to strategy, leadership, and the philosophy of conflict resolution.",
    chapters: [
      {
        title: "Chapter 1: Laying Plans",
        content: `The art of war is of vital importance to the State. It is a matter of life and death, a road either to safety or to ruin. Hence it is a subject of inquiry which can on no account be neglected.

The art of war, then, is governed by five constant factors: The Moral Law, Heaven, Earth, The Commander, and Method and Discipline.

The Moral Law causes the people to be in complete accord with their ruler, so that they will follow him regardless of their lives, undismayed by any danger.

Heaven signifies night and day, cold and heat, times and seasons. Earth comprises distances, great and small, danger and security, open ground and narrow passes, the chances of life and death.

The Commander stands for the virtues of wisdom, sincerity, benevolence, courage, and strictness. By method and discipline are to be understood the marshaling of the army, the maintenance of roads, and the control of military expenditure.

These five factors should be familiar to every general. He who knows them will win; he who knows them not will fail.

All warfare is based on deception. Hence, when able to attack, we must seem unable; when using our forces, we must appear inactive; when we are near, we must make the enemy believe we are far away.

Appear where you are not expected. Attack where the enemy is unprepared.

In the practical art of war, the best thing of all is to take the enemy's country whole and intact; to shatter and destroy it is not so good.

To fight and conquer in all your battles is not supreme excellence; supreme excellence consists in breaking the enemy's resistance without fighting.`
      },
      {
        title: "Chapter 3: Attack by Stratagem",
        content: `In the practical art of war, the best thing of all is to take the enemy's country whole and intact; to shatter and destroy it is not so good. So, too, it is better to recapture an army entire than to destroy it.

Hence to fight and conquer in all your battles is not supreme excellence; supreme excellence consists in breaking the enemy's resistance without fighting.

The highest form of generalship is to baulk the enemy's plans; the next best is to prevent the junction of the enemy's forces; the next in order is to attack the enemy's army in the field; and the worst policy of all is to besiege walled cities.

There are three ways in which a ruler can bring misfortune upon his army: By commanding the army to advance or to retreat, being ignorant of the fact that it cannot obey. This is called hobbling the army.

By attempting to govern an army in the same way as he administers a kingdom, being ignorant of the conditions which obtain in an army. This causes restlessness in the soldiers' minds.

By employing the officers of his army without discrimination, through ignorance of the military principle of adapting action to circumstance. This shakes the confidence of the soldiers.

Therefore the general who foreknows the places where the enemy is to be engaged and the places where he is to fight will march many thousand miles and encounter the enemy.

Know the enemy and know yourself; in a hundred battles you will never be in peril. When you are ignorant of the enemy but know yourself, your chances of winning or losing will be equal. If you know neither the enemy nor yourself, you will succumb in every battle.

The general who wins a battle makes many calculations in his temple before the battle is fought. The general who loses a battle makes but few calculations beforehand. Thus do many calculations lead to victory, and few calculations to defeat.

He who is prudent and lies in wait for an enemy who is not, will be victorious.`
      }
    ]
  },
  {
    id: "meditations",
    title: "Meditations",
    author: "Marcus Aurelius",
    genre: "Stoicism",
    cover: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800",
    description: "A series of personal writings by Roman Emperor Marcus Aurelius, recording his private notes to himself and ideas on Stoic philosophy, written while on military campaigns.",
    chapters: [
      {
        title: "Book 2: On Transience",
        content: `Begin the morning by saying to yourself: I shall meet with the busybody, the ungrateful, arrogant, deceitful, envious, unsocial. All these things happen to them by reason of their ignorance of what is good and evil.

But I who have seen the nature of the good that it is beautiful, and of the bad that it is ugly, and the nature of him who does wrong, that it is akin to me; not only of the same blood or seed, but that it participates in the same intelligence and the same portion of the divinity.

None of these things can injure me, for nobody can implicate me in what is degrading. Neither can I be angry with my kinsman or hate him. We have come into the world to work together, like feet, like hands, like eyelids, like the rows of the upper and lower teeth.

What is not good for the swarm is not good for the bee. If sailors berate their captain, and patients berate their physician, would they listen to anything else? How many ungrateful people have I already seen who were destroyed by ingratitude.

To live each day as though one's last, never flustered, never apathetic, never attitudinizing. Here is the perfection of character.

Think of yourself as dead. You have lived your life. Now, take what is left and live it properly.

Do not act as if you were going to live ten thousand years. Death hangs over you. While you live, while it is in your power, be good.

You might leave life right now. Let that determine what you do and say and think. The time for you to stop putting off what you love is now.

Never esteem anything as of advantage to you that will make you break your word or lose your self-respect.`
      },
      {
        title: "Book 5: On Purpose",
        content: `At dawn, when you have trouble getting out of bed, tell yourself: I have to go to work. As a human being, what I have to do is get out of bed and be a human being. Am I coming to life to snuggle under the covers and stay warm?

But it is pleasant under the covers. Then were you born to feel pleasant? Not to feel warm and comfortable? To do things and enjoy doing them?

Every living organism is complete in itself. The complete activity of a human being is a complete life. The activity of a human being at its best is a complete human life.

It is not the action of a wise person to retreat from the community. The wise person will try to live in community with his fellow human beings.

When you do something and you do it well, you do it for its own sake. You do it because it is good.

If you work at that which is before you with serious and scrupulous intention, vigilance, willingness, and love, and do not allow anything to distract you, you will live a good life. You will live a free life.

Consider what others think of you. They cannot think badly of you without first thinking about you. They cannot think about you without first being conscious of you.

The best revenge is not to be like your enemy.

The impediment to action advances action. What stands in the way becomes the way.

The universe is transformation; life is opinion. What we see is not the thing itself but how we interpret it.

Choose not to be harmed and you won't feel harmed. Don't feel harmed and you haven't been. The mind is its own place, and in itself can make a heaven of hell, a hell of heaven.

You have power over your mind, not outside events. Realize this, and you will find strength.`
      },
      {
        title: "Book 8: On Equanimity",
        content: `To live a good life: You have the power to discard all superfluous thoughts. You have the power to rid yourself of all emotions that trouble you. You have the power to reduce your desires. You have the power to control your reactions.

What is in us is like what is in the world. And what is in the world is like what is in us. The only thing that can turn events to our advantage is to use them as they happen.

The things you think about determine the quality of your mind. Your soul takes on the color of your thoughts.

The universal nature of things has two main aspects. The first is that causes are in constant circulation, producing and destroying things throughout the universe. The second is that the universe is in perpetual change, and even what exists is never quite the same.

If the gods don't exist, then being good is irrelevant. But they do exist, and they have given us the power to be good. Why should we not practice virtue?

What we need to do is focus all our efforts on improving our ability to think. No one can prevent you from thinking correctly. Nothing can stand in the way of pure reason.

How much more time do you need? The life of man is short. Begin to do what you can, and regard that as your purpose. The purpose of life is to be good to one another.

The impediment to action advances action. What stands in the way becomes the way. The obstacle on the path is the path.

The best way to avenge yourself is not to become like the wrongdoer.

Think of yourself as dead. You have lived your life. Now, take what's left and live it properly.

When you arise in the morning, think of what a precious privilege it is to be alive, to breathe, to think, to enjoy, to love.

Everything we hear is an opinion, not a fact. Everything we see is a perspective, not the truth.

Waste no more time arguing about what a good man should be. Be one.`
      }
    ]
  },
  {
    id: "seneca",
    title: "Letters from a Stoic",
    author: "Seneca",
    genre: "Stoicism",
    cover: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=800",
    description: "A collection of letters from the Stoic philosopher Seneca to his friend Lucilius, offering practical wisdom on living a meaningful life.",
    chapters: [
      {
        title: "Letter 1: On the Shortness of Life",
        content: `It is not that we have a short time to live, but that we waste a great deal of it. Life is long enough, and a sufficiently generous amount has been given to us for the highest achievements if it were all well invested.

But when it is wasted in heedless luxury and spent on no good activity, we are forced at last by death's final constraint to realize that it has passed away before we knew it was passing.

So it is: we do not receive a short life, we make it short. We are not ill-supplied, but wasteful of what we are given. Life is long if you know how to use it.

How long have you been alive? Most people stop living when they start to worry about living.

Retire into yourself as much as you can. Associate with people who are likely to improve you. Welcome those whom you are capable of improving.

You should be extending your stay among books and the masters at any age, and not just in the twilight years.

The greatest obstacle to living is expectancy, which hangs upon tomorrow and loses today. You are arranging what lies in Fortune's control, and abandoning what lies in yours.

Put off all other concerns and say: I have allowed enough time to pass. Now I will begin to put things in order.

It takes a whole lifetime to learn how to live. You might think it strange that this should be so, but remember there is always more to learn.

Nothing is more honorable than a grateful heart. True happiness is to enjoy the present, without anxious dependence upon the future.

It is the power of the mind to be unconquerable. We suffer more in imagination than in reality.

Begin at once to live, and count each separate day as a separate life.`
      },
      {
        title: "Letter 77: On Taking Our Own Life",
        content: `It is not that we have a short time to live, but that we waste a great deal of it. Life is long enough, and a sufficiently generous amount has been given to us for the highest achievements if it were all well invested.

But when it is wasted in heedless luxury and spent on no good activity, we are forced at last by death's final constraint to realize that it has passed away before we knew it was passing.

So it is: we do not receive a short life, we make it short. We are not ill-supplied, but wasteful of what we are given. Life is long if you know how to use it.

Retire into yourself as much as you can. Associate with people who are likely to improve you. Welcome those whom you are capable of improving.

The wise person will love, will rejoice in the fact that he is a human being, and will not be envious. He will not complain about the limitations of his condition, but will strive to overcome them.

There is no genius without a touch of madness. The mind that is anxious about future events is miserable.

True happiness is to enjoy the present, without anxious dependence upon the future, not to amuse ourselves with either hopes or fears but to rest satisfied with what we have, which is sufficient.

For he who is content with what he has is truly rich. The wise person is self-sufficient. He has everything he needs.

You act like mortals in all that you fear, and like immortals in all that you desire.

The whole future lies in uncertainty: live immediately. Make the most of what you have. The biggest waste of time is the gap between what we want and what we do.

As is a tale, so is life: not how long it is, but how good it is, is what matters. The wise person will live as long as they should, not as long as they can.

The mind that is anxious about future events is miserable. The wise person faces the future with equanimity, content in the present moment.`
      }
    ]
  }
];

export const genres = ["All", "Hinduism", "Buddhism", "Taoism", "Stoicism"];
