import React from 'react';
import { X, Shield, Swords, Sparkles, Trophy, Dices } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'hi' | 'en';
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose, language }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-xl max-h-[85vh] overflow-y-auto bg-slate-900 border border-slate-700 rounded-2xl p-6 text-slate-100 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Dices className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {language === 'hi' ? 'लूडो के नियम' : 'Rules of Ludo'}
              </h2>
              <p className="text-xs text-slate-400">
                {language === 'hi'
                  ? 'पारंपरिक और आधिकारिक खेल नियम'
                  : 'Official classic 2-player rules'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rule Items */}
        <div className="space-y-4 py-4 text-sm">
          {/* Rule 1 */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-800">
            <div className="p-2 rounded-lg bg-red-500/10 text-red-400 shrink-0 mt-0.5">
              <Dices className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-200">
                {language === 'hi'
                  ? '1. टोकन बाहर निकालना (Rolling a 6)'
                  : '1. Opening a Token (Rolling a 6)'}
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {language === 'hi'
                  ? 'बेस (यार्ड) से टोकन को मैदान में लाने के लिए पासे पर 6 आना आवश्यक है। 6 आने पर टोकन शुरुआती रंगीन खाने पर आ जाता है।'
                  : 'A roll of 6 is required to bring a token out from the yard to its colored start square.'}
              </p>
            </div>
          </div>

          {/* Rule 2 */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-800">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-200">
                {language === 'hi'
                  ? '2. सुरक्षित खाने (Safe Squares ⭐️)'
                  : '2. Safe Zones (Stars ⭐️ & Starts)'}
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {language === 'hi'
                  ? 'बोर्ड पर 4 शुरुआती खाने और 4 स्टार (⭐️) वाले खाने सुरक्षित हैं। इन खानों पर बैठे टोकन को कोई विरोधी काट नहीं सकता।'
                  : 'The 4 colored starting squares and the 4 star-marked squares are safe zones. Opponents cannot capture tokens resting on these squares.'}
              </p>
            </div>
          </div>

          {/* Rule 3 */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-800">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-200">
                {language === 'hi'
                  ? '3. विरोधी का टोकन काटना (Capture)'
                  : '3. Capturing Opponent Tokens'}
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {language === 'hi'
                  ? 'यदि आपका टोकन किसी गैर-सुरक्षित खाने पर विरोधी के टोकन पर उतरता है, तो विरोधी का टोकन कटकर वापस बेस में चला जाता है और आपको तुरंत एक अतिरिक्त चाल (Bonus Roll) मिलती है!'
                  : 'Landing on an opponent’s token on any non-safe square captures it back to their base, and awards you an immediate bonus roll!'}
              </p>
            </div>
          </div>

          {/* Rule 4 */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-800">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-200">
                {language === 'hi'
                  ? '4. बोनस चालें (Bonus Rolls)'
                  : '4. Extra Turns & Bonus Rolls'}
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {language === 'hi'
                  ? 'पासे पर 6 आने पर, विरोधी का टोकन काटने पर, या किसी टोकन के घर (Home) पहुंचने पर आपको फिर से पासा फेंकने का मौका मिलता है। (लगातार तीन 6 आने पर बारी समाप्त हो जाती है)।'
                  : 'You earn an extra roll whenever you roll a 6, capture an opponent’s token, or reach home. (Rolling three 6s in a row passes the turn).'}
              </p>
            </div>
          </div>

          {/* Rule 5 */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-800">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 shrink-0 mt-0.5">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-200">
                {language === 'hi'
                  ? '5. घर पहुंचना और विजय (Victory)'
                  : '5. Entering Home & Victory'}
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {language === 'hi'
                  ? 'पूरा चक्कर लगाने के बाद टोकन अपने रंगीन रास्ते से केंद्रीय घर में प्रवेश करता है। घर पहुंचने के लिए सटीक अंक चाहिए। जो खिलाड़ी सबसे पहले अपने सभी टोकन घर पहुंचाता है, वह जीत जाता है!'
                  : 'After a full lap, tokens enter their colored home column. An exact roll is required to reach the center home. The first player to get all target tokens home wins!'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-sm font-semibold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors cursor-pointer"
          >
            {language === 'hi' ? 'समझ गया, खेलें!' : 'Got it, let’s play!'}
          </button>
        </div>
      </div>
    </div>
  );
};
