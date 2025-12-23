class WrittenTracker {
    constructor() {
        this.totalQuestions = 5;
        this.num_tracked = document.getElementById('num-tracked');
        this.written_count = document.getElementById('qcm-count');
        this.answers = {};
        this.loadSavedAnswers();
        if (this.num_tracked && this.written_count) {
            this.textareaListen();
            this.update();
        }
    }
    loadSavedAnswers() {
        
            const currentAnswers = JSON.parse(sessionStorage.getItem('currentAnswers'));
            if (currentAnswers && currentAnswers.written) {
                this.answers = currentAnswers.written;
            } else {
                const progress = JSON.parse(localStorage.getItem('quizProgress'));
                if (progress && progress.written && progress.written.answers) {
                    this.answers = progress.written.answers;
                }
            }
            this.applySavedAnswers();
    }
    applySavedAnswers(){
        Object.keys(this.answers).forEach(questionId => {
            const textarea = document.getElementById(questionId);
            if (textarea){
                textarea.value = this.answers[questionId];
            }
        });
    }

    textareaListen(){
        let textareas = document.querySelectorAll('textarea[id^="written-q"]');
        textareas.forEach(textarea => {
            let timeout;
            textarea.addEventListener('input', () => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    this.answers[textarea.id] = textarea.value;
                    this.update();
                    QuizStatus.updateSectionProgress('written', this.countAnswered(), this.answers);
                }, 500);
            });
            textarea.addEventListener('blur', () => {
                this.answers[textarea.id] = textarea.value;
                QuizStatus.updateSectionProgress('written', this.countAnswered(), this.answers);
            });
        });
    }
    countAnswered(){
        return Object.keys(this.answers).filter(key => {
            return this.answers[key] && this.answers[key].trim().length > 0;
        }).length;
    }
    update() {
        let answer_num = this.countAnswered();
        let progressPercent = (answer_num/this.totalQuestions) * 100;
        
        if (this.num_tracked){
            this.num_tracked.innerHTML = '';
            let fill = document.createElement('div');
            fill.className = 'progress-fill h-full bg-[#47FF37] rounded-full transition-all duration-300';
            fill.style.width = `${progressPercent}%`;
            this.num_tracked.appendChild(fill);
        }     
        if (this.written_count){
            this.written_count.textContent = `${answer_num}/${this.totalQuestions}`;
        }
    }
}
document.addEventListener('DOMContentLoaded', () => {
    new WrittenTracker();
});