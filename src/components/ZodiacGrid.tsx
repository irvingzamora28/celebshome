import Link from 'next/link';

const zodiacSigns = [
    { name: 'Aries', emoji: '♈', period: 'Mar 21 - Apr 19' },
    { name: 'Taurus', emoji: '♉', period: 'Apr 20 - May 20' },
    { name: 'Gemini', emoji: '♊', period: 'May 21 - Jun 20' },
    { name: 'Cancer', emoji: '♋', period: 'Jun 21 - Jul 22' },
    { name: 'Leo', emoji: '♌', period: 'Jul 23 - Aug 22' },
    { name: 'Virgo', emoji: '♍', period: 'Aug 23 - Sep 22' },
    { name: 'Libra', emoji: '♎', period: 'Sep 23 - Oct 22' },
    { name: 'Scorpio', emoji: '♏', period: 'Oct 23 - Nov 21' },
    { name: 'Sagittarius', emoji: '♐', period: 'Nov 22 - Dec 21' },
    { name: 'Capricorn', emoji: '♑', period: 'Dec 22 - Jan 19' },
    { name: 'Aquarius', emoji: '♒', period: 'Jan 20 - Feb 18' },
    { name: 'Pisces', emoji: '♓', period: 'Feb 19 - Mar 20' },
];

export default function ZodiacGrid() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {zodiacSigns.map((sign) => (
                <Link
                    key={sign.name}
                    href={`/zodiac/${sign.name.toLowerCase()}`}
                    className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-6"
                >
                    <div className="text-center">
                        <div className="text-5xl mb-3 transition-transform duration-300 group-hover:scale-110">
                            {sign.emoji}
                        </div>
                        <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-100 mb-2">
                            {sign.name}
                        </h3>
                        <p className="text-sm text-indigo-600 dark:text-indigo-300 font-medium">
                            {sign.period}
                        </p>
                    </div>
                </Link>
            ))}
        </div>
    );
}