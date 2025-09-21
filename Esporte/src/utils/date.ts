export function formatRelativeTime(timestamp: string): string {
    const now = Date.now();
    const then = new Date(timestamp).getTime();
    const diffSec = Math.floor((now - then) / 1000);

    if (diffSec < 60) return `enviado há ${diffSec} segundo${diffSec!==1?'s':''}`;
    const diffMin = Math.floor(diffSec/60);
    if (diffMin < 60) return `enviado há ${diffMin} minuto${diffMin!==1?'s':''}`;
    const diffHrs = Math.floor(diffMin/60);
    if (diffHrs < 24) return `enviado há ${diffHrs} hora${diffHrs!==1?'s':''}`;
    const diffDays = Math.floor(diffHrs/24);
    if (diffDays < 7) return `enviado há ${diffDays} dia${diffDays!==1?'s':''}`;
    const diffWeeks = Math.floor(diffDays/7);
    if (diffWeeks < 4) return `enviado há ${diffWeeks} semana${diffWeeks!==1?'s':''}`;
    const diffMonths = Math.floor(diffDays/30);
    if (diffMonths < 12) return `enviado há ${diffMonths} mês${diffMonths!==1?'es':''}`;
    const diffYears = Math.floor(diffDays/365);
    return `enviado há ${diffYears} ano${diffYears!==1?'s':''}`;
}