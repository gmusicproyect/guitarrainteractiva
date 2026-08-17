/**
 * GMUSIC EXERCISE RUNNER: multiple_choice (§4.10)
 * Preguntas conceptuales sobre grados (I-vii°), cifrado americano e intervalos.
 */

export class MultipleChoiceRunner {
  /**
   * @param {Object} exerciseData - e.g. {
   *   type: "multiple_choice",
   *   pregunta: "¿Qué grado es Si en Sol mayor?",
   *   opciones: ["III", "IV", "V"],
   *   respuesta: "III"
   * }
   * @param {Object} userInput - { seleccion: string }
   */
  static evaluate(exerciseData, userInput) {
    const target = exerciseData.respuesta;
    const isCorrect = userInput.seleccion === target;

    if (isCorrect) {
      return {
        success: true,
        seleccion: userInput.seleccion,
        feedback: `¡Correcto! ${target} es la respuesta adecuada.`
      };
    } else {
      return {
        success: false,
        seleccion: userInput.seleccion,
        feedback: `${userInput.seleccion} no es correcto. Inténtalo de nuevo.`
      };
    }
  }
}
