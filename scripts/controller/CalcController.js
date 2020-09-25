class CalcController {

    constructor() {

        //o underline informa que o encapsulamento do atributo é private.
        this._operation = [];//array para guardar as operacoes aritméticas
        this._locale = "pt-br";
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate;
        this.initialize();
        this.initButtonsEvents();
    }

    //Getters e Setters
    get displayTimeGet() {

        return this._timeEl.innerHTML;
    }

    set displayTimeSet(value) {

        this._timeEl.innerHTML = value;
    }

    get displayDateGet() {

        return this._dateEl.innerHTML;
    }

    set displayDateSet(value) {

        this._dateEl.innerHTML = value;
    }

    get displayCalcGet() {

        return this._displayCalcEl.innerHTML;
    }

    set displayCalcSet(value) {

        this._displayCalcEl.innerHTML = value;

    }

    get currentDateGet() {

        return this._currentDate = new Date();

    }

    set currentDateSet(value) {

        this._currentDate = value;

    }

    initialize() {

        //Inicializando o display da calculadora que vai ser 0
        this.setLastNumberToDisplay();

        this.setDisplayDateTime();//Chamei esse metodo para a hora e data nao precisar esperar 1 segundo para aparecer na tela da calculadora

        /*usando a função setIterval, é executado determinado procedimento
        em um intervalo de tempo, marcaso em milisegundos.*/
        setInterval(() => {

            this.setDisplayDateTime();

        }, 1000);

        /*A função setTimeout faz com que o JS espere um tempo e execute uma vez a função 
        setTimeout(()=>{

            clearInterval(interval);
            //Após 10 segundos estou interrompendo a função setInterval passando seu Id gravado na varivel interval.
            //Caso quisesse parar um setTimeout só usar o clearTimeout(passando o id do timeout)

        }, 10000);
        */
    }

    //Esse método para setar a data e hora atual. Bem como ele pode ser reutilizado.
    setDisplayDateTime() {

        this.displayDateSet = this.currentDateGet.toLocaleDateString(this._locale, {

            day: "2-digit",//ou numeric
            month: "short",//ou long que mostra o nome completo do mês
            year: "numeric"//ou 2-digit que mostra os dois ultimos digitos do ano.

        });

        this.displayTimeSet = this.currentDateGet.toLocaleTimeString(this._locale);

    }

    setLastNumberToDisplay() {

        let lastNumber;
        /*Nesse laço eu varro o array ao contrario do ultimo ao primeiro e se ele não for um operador ele será um numero,
        logo eu adiciono ele na variavel lastNumber e depois paro o for e fora do for eu adiciono esse numero ao display da calculadora.*/
        for (let i = this._operation.length - 1; i >= 0; i--) {

            //Esse !(exclamação) siginifica que estou negando, ou seja, Se NÃO for um número eu pego o valor da posição do array e seto na variavel.
            if (!this.isOperator(this._operation[i])) {

                lastNumber = this._operation[i];
                break;

            }

        }
        //Se não existir nenhum valor entao, o ultimo numero vai ser 0
        if(!lastNumber) lastNumber = 0;

        //Setando no display da calculadora o valor capturado.
        this.displayCalcSet = lastNumber;

    }

    //Método para o botao AC que irá limpar tudo, zerar o array de operações.
    clearAll() {

        this._operation = [];
        
        //Metodo para setar o ultimo numero no display, nesse caso 0
        this.setLastNumberToDisplay();
    }

    //Método para o botao CE que irá limpar a ultima entrada ou ultima operacao.
    clearEntry() {

        this._operation.pop(); //removendo a ultima entrada do array com o pop
        
        //Metodo para setar o ultimo numero no display, nesse caso ele remove a ultima entrada.
        //Tipo se eu digitei 10 + 30, quando clicar no botao CE ele remove o 30 e fica só o 10
        this.setLastNumberToDisplay();
    }

    //Método para caso o usuario aperte algum botao diferente dos existentes ai ele mostra error no display.
    setError() {

        this.displayCalcSet = "Error";

    }

    //Método para pegar a ultima entrada do array de operações.
    getLastOperation() {

        return this._operation[this._operation.length - 1];

    }

    /*Método para setar o ultimo valor digitado pelo usuario na mesma posição e não criar outra posicao para salvar esse valor.
    Por exemplo o usuario digita 3 vai ser salvo [3] depois digita 2 o sistema junta e vira 32 e coloca na posicao que estava antes [32]
    e não [3,32]*/
    setLastOperation(value) {

        this._operation[this._operation.length - 1] = value;

    }

    /*Método para verificar os operadores aritméticos. Dentro de um array estão eles e está se usando o indexOf para pegar 
    o indice deles quando for verdadeiro, e esse -1 é caso retorne um valor diferentes desses ele retorna false, ou seja, que nao é
    um operador.*/
    isOperator(value) {

        return ['+', '-', '*', '/', '%'].indexOf(value) > -1;

    }

    //Método para realizar os calculos dos pares de valores.
    calc() {

        //Inicializando com vazio para que quando clicar no botão de "igual" ele não remova o terceiro valor do array
        //e descomplete a operação
        let last = '';

        //Se o array tiver mais que 3 valores, ou seja, [10 + 10 +] removo o ultimo valor.
        if (this._operation.length > 3){

            //Removo o ultimo valor do array e guardo nessa variavel para usá-la de novo na continuacao da operacao
            last = this._operation.pop();
        }

        //Com o join junto todo o par de operacao que ta no array e transformo em uma string tirando as virgulas
        //ex: [10,"+",10], agora ficou "10+10" e o eval() realiza o calculo dessa operação e add esse calculo dentro da variavel
        let result = eval(this._operation.join(""));

        //Tratando quando o operador for o porcento eu pego os valores e divido por 100 depois salvo no array o resultado.
        if (last == "%") {

            resultPorcent = result / 100;
            this._operation = [resultPorcent];


        }
        else {

            /*Aqui eu inicializo de novo array com o resultado da operacao, e depois verifico 
            se ultimo valor do antigo array tem algum valor se sim add ele no array. Ex: [100,"+"]*/
            this._operation = [result];

            if(last != '') {this._operation.push(last);}

        }

        //Setando o valor calculado no display da calculadora
        this.setLastNumberToDisplay();

        console.log(this._operation);
    }

    /*Nesse método eu irei realizar os pushs no array quando os pares de operações estiverem montados
    para realizar o calculo deles e seguir. Tipo 10 + 10 aí add no array ou seja se o array tiver 3 posicoes e seja 1 numero 
    1 operador e outro numero ai jogo no array.*/
    pushOperation(value) {

        this._operation.push(value);

        //validando se o array está com 3 posições preenchidas. Ex[10,"+","10"]
        if (this._operation.length > 3) {

            //Chamando o metodo calc() que exclui o ultimo valor do array após a 
            //terceira posicao e guarda numa variavel para pegar o valor calculado e continuar o processo.
            this.calc();

        }

    }

    //Método para setar os valores no array de operações, para isso usa-se o push.
    addOperation(value) {

        /*Nessa validação vejo se a ultima entrada é um numero ou uma string. A ideia é separar os numeros
        dos operadores(+ -) se não for um numero, ou seja ele é um operador eu realizo alguma coisa e se 
        for um numero eu transformo em string e concateno. */
        if (isNaN(this.getLastOperation())) {

            if (this.isOperator(value)) {

                this.setLastOperation(value);

                /*Se for um operador eu estou subsituindo,o ultimo valor do meu array por outro operador. 
                Por exemplo eu digito um "+" e depois clico no "-" aí troco o "mais" pelo "menos"*/

            } else if (isNaN(value)) {

                console.log('outra coisa');

            } else {
                //inicializando o array com algum valor no caso o undefined.
                this.pushOperation(value);

                //Chamo esse método aqui caso o primeiro botao clicado seja um numero ele mostre no display tbm.
                this.setLastNumberToDisplay();

            }

        }
        else {

            /*Nesse if eu valido de novo se é um operador ,caso o ultimo dado do array se sim, 
            aí eu adiciono ele dentro do array.*/
            if (this.isOperator(value)) {

                this.pushOperation(value);

                //Se não, então é um numero ai eu concateno com o ultimo.
            } else {


                //Concatenando o ultimo valor do array com o valor atual.
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(parseInt(newValue));//add esse valor concatenado ao array, por exemplo 102 que o usuario pode ter clicado 1,0,2 ou 10, 2.

                //Atualizando o display
                this.setLastNumberToDisplay();

            }

        }

    }

    execBtn(value) {

        switch (value) {

            case 'ac':
                this.clearAll();

                break;

            case 'ce':
                this.clearEntry();

                break;

            case 'porcento':
                this.addOperation('%');

                break;

            case 'divisao':
                this.addOperation('/');

                break;

            case 'multiplicacao':
                this.addOperation('*');

                break;

            case 'subtracao':
                this.addOperation('-');

                break;

            case 'soma':
                this.addOperation('+');

                break;

            case 'igual':
                this.calc(); //chamando o método de calcular que já dá todo o resultado
                break;

            case 'ponto':
                this.addOperation('.');

                break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;

            default:
                this.setError();

                break;


        }


    }

    /*método que ira capturar múltiplos eventos. Ele separa usando o split com forEach que
 percorre todo o array de eventos que estou passando no segundo parâmetro ao chamar esse 
 método no método iniButtonsEvents*/
    addEventListenerAll(element, events, fn) {

        events.split(' ').forEach(event => {

            element.addEventListener(event, fn, false);
            /*Adicionando o evento(click, drag ...) ao element que é o botão, depois a função que irá executar
            e por ultimo deixando false para capturar apenas um click caso o usuario clique no
            texto ou no botão ele captura apenas um dos dois. Fazendo com que, por exemplo se ele
            clicar no texto e no botao 9, não seja capturado o 9 duas vezes.*/

        });


    }

    initButtonsEvents() {

        let buttons = document.querySelectorAll("#buttons > g, #parts > g");

        //forEach para percorrer todos os botoes e dentro capturar o evento de click de cada um deles.
        buttons.forEach((btn, index) => {

            this.addEventListenerAll(btn, 'click drag', e => {

                let textBtn = btn.className.baseVal.replace("btn-", "");
                //className captura o name da class e baseVal ele trata o valor dela por conta do svg
                //e o replace eu to substituindo o btn- por nada pra trazer só o numero

                this.execBtn(textBtn);

            });

            /* nessa chamada do método addEventListenerAll estamos fazendo com que caso o
            usuário passe o mouse em cima do botao, ou arraste pra cima ou para baixo ele mude
            o cursor para a mãozinha que é o estilo pointer*/
            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e => {

                btn.style.cursor = "pointer";


            });

        });
    }

}