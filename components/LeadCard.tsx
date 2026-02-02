import React, { useState, useEffect } from 'react';
import { Lead } from '../types';
import { generateSalesPitch } from '../services/geminiService';
import { AlertTriangle, Star, MapPin, Phone, Mail, Sparkles, Loader2, Copy } from 'lucide-react';

interface LeadCardProps {
  lead: Lead;
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead }) => {
  const [pitch, setPitch] = useState<string | null>(lead.ai_pitch || null);
  const [loadingPitch, setLoadingPitch] = useState(false);

  useEffect(() => {
    // Only generate pitch if it's a pain point, has review text, AND we don't have one yet
    if (lead.type === 'pain_point' && lead.review_text && !pitch) {
      const fetchPitch = async () => {
        setLoadingPitch(true);
        const result = await generateSalesPitch(lead.business_name, lead.review_text!);
        setPitch(result);
        setLoadingPitch(false);
      };
      
      fetchPitch();
    }
  }, [lead.id, lead.type, lead.business_name, lead.review_text, pitch]);

  const isPainPoint = lead.type === 'pain_point';

  return (
    <div className="bg-surface border border-border rounded-lg p-5 hover:border-primary/50 transition-all shadow-sm group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg text-white group-hover:text-primary transition-colors">{lead.business_name}</h3>
            {isPainPoint && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-950/50 text-red-500 text-xs font-medium border border-red-900">
                <AlertTriangle size={12} />
                VAPI Opportunity
              </span>
            )}
            {!isPainPoint && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                <Sparkles size={12} />
                Fresh Lead
              </span>
            )}
          </div>
          <div className="flex items-center text-zinc-500 text-sm gap-4">
            <span className="flex items-center gap-1">
              <Star size={14} className={isPainPoint ? "text-red-500" : "text-primary"} fill={isPainPoint ? "currentColor" : "currentColor"} />
              {lead.rating.toFixed(1)}
            </span>
            <span className="text-zinc-700">|</span>
            <span className="flex items-center gap-1">
              <MapPin size={14} />
              Google Maps
            </span>
          </div>
        </div>
      </div>

      {isPainPoint && lead.review_text && (
        <div className="mb-4 bg-red-950/20 border border-red-900/30 rounded-md p-3">
          <p className="text-zinc-300 text-sm italic">"{lead.review_text}"</p>
        </div>
      )}

      {/* AI Sales Pitch Section */}
      {isPainPoint && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
             <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                <Sparkles size={12} className="text-primary" />
             </div>
             <span className="text-xs font-semibold text-primary uppercase tracking-wider">AI Generated Pitch</span>
          </div>
          
          <div className="bg-zinc-900 rounded-md p-3 border border-border min-h-[60px] relative">
            {loadingPitch ? (
               <div className="flex items-center gap-2 text-zinc-500 text-sm">
                 <Loader2 size={16} className="animate-spin" />
                 Analyzing review sentiment...
               </div>
            ) : (
              <p className="text-zinc-300 text-sm leading-relaxed selection:bg-primary/30 selection:text-white">
                {pitch || "Pitch generation failed."}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2 text-sm text-zinc-500 group/item cursor-pointer hover:text-white transition-colors">
          <Mail size={14} />
          <span className="text-zinc-300 select-all">{lead.email || 'N/A'}</span>
          {lead.email && <Copy size={12} className="opacity-0 group-hover/item:opacity-100 transition-opacity text-primary" />}
        </div>
        <div className="flex items-center gap-2 text-sm text-zinc-500 group/item cursor-pointer hover:text-white transition-colors">
          <Phone size={14} />
          <span className="text-zinc-300 select-all">{lead.phone || 'N/A'}</span>
          {lead.phone && <Copy size={12} className="opacity-0 group-hover/item:opacity-100 transition-opacity text-primary" />}
        </div>
      </div>
    </div>
  );
};