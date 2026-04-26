// Reset today's progress - run this in browser console if needed
export const resetTodayProgress = () => {
  const today = new Date().toISOString().split('T')[0]
  localStorage.setItem(`progress_${today}`, '0')
  localStorage.setItem('last_tracking_date', today)
  console.log('Today\'s progress reset to 0')
  window.location.reload()
}