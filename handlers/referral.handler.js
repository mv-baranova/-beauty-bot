/**
 * Placeholder for referral system.
 */
async function referralHandler(ctx) {
  const userId = ctx.from.id;
  const inviteLink = `https://t.me/${ctx.me.username}?start=ref_${userId}`;

  await ctx.reply(
    `приглашай подружек и получай доступ к премиум разборам ✨\n\nтвоя ссылка: ${inviteLink}\n\nприглашено: ${ctx.session.referrals.count || 0} ☁️`,
    { disable_web_page_preview: true }
  );
}

module.exports = {
  referralHandler,
};
