class QuizStatus {
    constructor() {
        this.totalSections = 15;
        this.mcqCount = document.getElementById('mcq-count');
        this.writtenCount = document.getElementById('written-count');
        this.labCount = document.getElementById('lab-count');
        this.totalCount = document.getElementById('total-count');
        this.initializeStorage();
        window.addEventListener('storage', this.handleStorageEvent.bind(this));
        window.addEventListener('quizProgressUpdated', this.update.bind(this));
        this.update();
        this.setupPeriodicSync();
    }

    initializeStorage(){
        if (!localStorage.getItem('quizProgress')) {
            localStorage.setItem('quizProgress', JSON.stringify({
                mcq: { answered: 0, total: 5, answers: {} },
                written: { answered: 0, total: 5, answers: {} },
                lab: { answered: 0, total: 5, answers: {} }
            }));
        }
        if (!sessionStorage.getItem('currentAnswers')) {
            sessionStorage.setItem('currentAnswers', JSON.stringify({
                mcq: {},
                written: {},
                lab: {}
            }));
        }
    }

    setupPeriodicSync() {
        setInterval(() => {
            this.update();
        }, 2000);
    }

    handleStorageEvent(event) {
        if (event.key === 'quizProgress') {
            this.update();
        }
    }

    update() {
        
            const progress = JSON.parse(localStorage.getItem('quizProgress')) || {
                mcq: { answered: 0, total: 5 },
                written: { answered: 0, total: 5 },
                lab: { answered: 0, total: 5 }
            };
            if(this.mcqCount) {
                const mcqAnswered = progress.mcq.answered || 0;
                this.mcqCount.textContent = `${mcqAnswered}/5`;
                this.mcqCount.style.color = mcqAnswered > 0 ? '#F8844D' : '#111827';
            }
            if(this.writtenCount) {
                const writtenAnswered = progress.written.answered || 0;
                this.writtenCount.textContent = `${writtenAnswered}/5`;
                this.writtenCount.style.color = writtenAnswered > 0 ? '#F8844D' : '#111827';
            }
            if(this.labCount) {
                const labAnswered = progress.lab.answered || 0;
                this.labCount.textContent = `${labAnswered}/5`;
                this.labCount.style.color = labAnswered > 0 ? '#F8844D' : '#111827';
            }
            if (this.totalCount) {
                const totalAnswered = (progress.mcq.answered || 0) + 
                                     (progress.written.answered || 0) + 
                                     (progress.lab.answered || 0);
                const totalPercent = Math.round((totalAnswered / this.totalSections) * 100);
                this.totalCount.textContent = `${totalAnswered}/${this.totalSections} (${totalPercent}%)`;
            }
    }
    static updateSectionProgress(section, answeredCount, answers = {}) {
            const progress = JSON.parse(localStorage.getItem('quizProgress'))||{
                mcq: { answered: 0, total:5, answers: {} },
                written: { answered: 0, total:5, answers: {} },
                lab: { answered: 0, total:5, answers: {} }
            };
            if (progress[section]) {
                progress[section].answered = answeredCount;
                progress[section].answers = answers;
            }
            localStorage.setItem('quizProgress', JSON.stringify(progress));
            const currentAnswers = JSON.parse(sessionStorage.getItem('currentAnswers')) || {
                mcq: {},
                written: {},
                lab: {}
            };
            
            currentAnswers[section] = answers;
            sessionStorage.setItem('currentAnswers', JSON.stringify(currentAnswers));
            localStorage.setItem('quizProgressUpdate', Date.now().toString());
            window.dispatchEvent(new CustomEvent('quizProgressUpdated'));
        
    }
    static clearAllStorage() {
        localStorage.removeItem('quizProgress');
        localStorage.removeItem('quizProgressUpdate');
        sessionStorage.removeItem('currentAnswers');
        localStorage.setItem('quizProgress', JSON.stringify({
            mcq: { answered: 0, total: 5, answers: {} },
            written: { answered: 0, total: 5, answers: {} },
            lab: { answered: 0, total: 5, answers: {} }
        }));
        sessionStorage.setItem('currentAnswers', JSON.stringify({
            mcq: {},
            written: {},
            lab: {}
        }));
        
        console.log('All quiz storage cleared and reset');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new QuizStatus();
});