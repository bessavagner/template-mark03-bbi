/**
 * LazyMount registra observadores para inicializar componentes quando entram na viewport.
 */
export class LazyMount {
  /**
   * @param {string} sectionId - ID do <section>
   * @param {() => void} callback - Função para inicializar a seção
   */
  static observe(sectionId, callback) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            callback();
            obs.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "0px",
        threshold: 0.2, // pode ajustar para mais sensível
      }
    );

    observer.observe(section);
  }
}
