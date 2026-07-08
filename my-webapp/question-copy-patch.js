(function () {
  const replacements = new Map([
    [
      "이 장면에서 그 인물은 어떤 마음이었을까?",
      (name) => `${name}의 주된 마음, 생각은 무엇일까?`
    ],
    [
      "그 인물이 가장 바랐거나 두려워한 것은 무엇일까?",
      (name) => `${name}의 소원이나 바람은 무엇일까?`
    ],
    [
      "그 인물의 마음이 바뀐 순간은 어디였을까?",
      () => "인물의 행동이나 태도가 바뀌었다면 그 이유는 무엇일까?"
    ]
  ]);

  function getSelectedCharacterName() {
    const title = document.querySelector("#chatTitle")?.textContent || "";
    const match = title.match(/①\s+(.+?)의 마음/);
    return match?.[1]?.trim() || "인물";
  }

  function patchQuestionButton(button) {
    const currentText = (button.dataset.questionText || button.textContent || "").trim();
    const replacement = replacements.get(currentText);
    if (!replacement) return;

    const nextText = replacement(getSelectedCharacterName());
    button.textContent = nextText;
    button.dataset.questionText = nextText;
  }

  function patchQuestionButtons() {
    document.querySelectorAll(".detail-button").forEach(patchQuestionButton);
  }

  const observerTarget = document.querySelector("#questionPanel") || document.body;
  const observer = new MutationObserver(patchQuestionButtons);
  observer.observe(observerTarget, { childList: true, subtree: true });
  patchQuestionButtons();
})();
