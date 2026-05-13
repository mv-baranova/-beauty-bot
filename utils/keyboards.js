const { InlineKeyboard } = require('grammy');

/**
 * Keyboards for different stages and contexts.
 */

const keyboards = {
  // Post-analysis contextual buttons
  postAnalysis: new InlineKeyboard()
    .text('🎨 цвета', 'action_colors')
    .text('💄 макияж', 'action_makeup')
    .row()
    .text('🛍 что купить', 'action_shop')
    .text('🖤 pinterest vibe', 'action_vibe')
    .row()
    .text('✨ визуализировать', 'action_visualize')
    .text('☕ fashion roast', 'action_roast')
    .row()
    .text('📸 сохранить', 'action_save'),

  // Vibe/Pinterest response contextual buttons
  postVibe: new InlineKeyboard()
    .text('👗 собрать образ', 'action_build_look')
    .text('☕ fashion roast', 'action_roast')
    .row()
    .text('✨ визуализировать', 'action_visualize')
    .row()
    .text('📸 сохранить разбор', 'action_save'),

  // New Visualization Specific Keyboard
  visualActions: new InlineKeyboard()
    .text('🖤 pinterest aesthetic', 'visual_pinterest')
    .text('👗 примерить стиль', 'visual_try_on')
    .row()
    .text('📸 fashion shot', 'visual_shot')
    .text('☁️ moodboard', 'visual_moodboard')
    .row()
    .text('✨ визуализировать образ', 'action_visualize'),

  // Onboarding goals
  onboardingGoal: new InlineKeyboard()
    .text('найти свой стиль ✨', 'goal_find_style')
    .row()
    .text('разобрать ошибки 🎀', 'goal_fix_mistakes')
    .row()
    .text('собрать капсулу 🛍', 'goal_capsule')
    .row()
    .text('просто по фану ☁️', 'goal_fun'),

  // Onboarding style
  onboardingStyle: new InlineKeyboard()
    .text('minimalist 🖤', 'style_minimalist')
    .text('old money 💎', 'style_old_money')
    .row()
    .text('streetwear 👟', 'style_streetwear')
    .text('coquette 🎀', 'style_coquette')
    .row()
    .text('не знаю, помоги! ✨', 'style_unknown'),

  // Onboarding budget
  onboardingBudget: new InlineKeyboard()
    .text('эконом ☁️', 'budget_low')
    .text('мидл ✨', 'budget_mid')
    .row()
    .text('люкс 💎', 'budget_high')
    .text('не важно 💸', 'budget_any'),
};

module.exports = keyboards;
