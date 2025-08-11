const exprEl = document.getElementById('expression');
const resultEl = document.getElementById('result');
let expr = '';

function updateDisplay(){
  exprEl.textContent = expr || '0';
}

function safeEvaluate(input){
  if(!/^[0-9+\-*/(). %]+$/.test(input)) throw new Error('Invalid characters');
  input = input.replace(/(\d+(?:\.\d+)?)%/g, '($1/100)');
  return Function('return (' + input + ')')();
}

document.querySelectorAll('button').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const v = btn.dataset.value;
    const action = btn.dataset.action;

    if(action === 'clear') { expr = ''; resultEl.textContent = '0'; updateDisplay(); return }
    if(action === 'back') { expr = expr.slice(0,-1); updateDisplay(); return }
    if(action === 'percent') { expr += '%'; updateDisplay(); return }
    if(action === 'equals') {
      try{
        const val = safeEvaluate(expr || '0');
        resultEl.textContent = String(val);
        expr = String(val);
      }catch(e){ resultEl.textContent = 'Error'; }
      updateDisplay();
      return
    }

    if(v){
      const last = expr.slice(-1);
      if(/[+\-*/.]/.test(last) && /[+\-*/.]/.test(v)){
        if(v !== '.') expr = expr.slice(0,-1) + v;
        else expr += v;
      } else {
        expr += v;
      }
      updateDisplay();
    }
  })
})

window.addEventListener('keydown', (e)=>{
  if(e.key === 'Enter') { document.querySelector('[data-action="equals"]').click(); e.preventDefault(); return }
  if(e.key === 'Backspace') { document.querySelector('[data-action="back"]').click(); return }
  if(e.key === 'Escape') { document.querySelector('[data-action="clear"]').click(); return }
  const allowed = '0123456789+-*/().%';
  if(allowed.includes(e.key)){
    const btn = document.querySelector(`[data-value="${e.key}"]`);
    if(btn) btn.click();
  }
})