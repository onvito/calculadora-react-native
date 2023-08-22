import { SafeAreaView, StyleSheet, View } from "react-native";
import { Component } from "react";

import Button from "./src/components/Button";
import Display from "./src/components/Display";

//Definindo o ponto inicial da calculadora com os parametros que eu vou precisar
const initialState = {
  displayValue: "0",
  clearDisplay: false,
  operation: null,
  values: [0, 0],
  current: 0,
};

//Criando uma função baseada em classe
export default class App extends Component {
  //Clonando o ponto inicial e atribuindo ao state
  state = { ...initialState };

  //Criando a lógica da adição de número
  addDigit = (n) => {
    //Esta linha calcula a variável clearDisplay, que é um indicador de se o visor deve ser apagado antes de inserir um novo dígito.
    //Isso ocorre quando o visor atual contém um "0" ou quando clearDisplay é verdadeiro
    // (indicando que a calculadora está em um estado de recém-início de entrada).
    const clearDisplay = this.state.displayValue === "0" || this.state.clearDisplay;

    // Aqui, é verificado se o dígito sendo adicionado é um ponto decimal ("."). Se for, verifica-se se o ponto decimal já está presente no displayValue.
    // Se já estiver, o retorno precoce da função ocorre para evitar a inclusão de múltiplos pontos decimais no mesmo número.
    if (n === "." && !clearDisplay && this.state.displayValue.includes(".")) {
      return;
    }

    //Esta linha define currentValue como uma string vazia se clearDisplay for verdadeiro (ou seja, o visor deve ser limpo)
    //Caso contrário, ele é definido como o valor atual no displayValue.
    const currentValue = clearDisplay ? "" : this.state.displayValue;

    //Aqui, a variável displayValue é atualizada concatenando o currentValue com o novo dígito ou ponto.
    const displayValue = currentValue + n;

    //O estado é atualizado com o novo displayValue, e clearDisplay é definido como falso para permitir a entrada contínua de dígitos.
    this.setState({ displayValue, clearDisplay: false });

    //Aqui começa a lógica para atualizar os valores utilizados para cálculos. Se o dígito adicionado não for um ponto decimal, a lógica continua:
    if (n !== ".") {
      //O novo valor é convertido de string para um número de ponto flutuante.
      const newValue = parseFloat(displayValue);

      //Uma cópia do array de valores existente é feita para ser modificada.
      const values = [...this.state.values];

      //O novo valor é atribuído à posição correta do array (dependendo do valor de current, que é o índice do valor sendo modificado).
      values[this.state.current] = newValue;

      //O estado é atualizado com os novos valores.
      this.setState({ values });
    }
  };

  clearMemory = () => {
    this.setState({ ...initialState });
  };

  setOperation = (operation) => {
    if (this.state.current === 0) {
      this.setState({ operation, current: 1, clearDisplay: true });
    } else {
      const equals = operation === "=";
      const values = [...this.state.values];
      try {
        values[0] = eval(`${values[0]} ${this.state.operation} ${values[1]}`);
      } catch (e) {
        values[0] = this.state.values[0];
      }
      values[1] = 0;
      this.setState({
        //Garantindo que o tipeOf do display value seja sempre string para evitar erros
        displayValue: `${values[0]}`,
        operation: equals ? null : operation,
        current: equals ? 0 : 1,
        // clearDisplay: !equals,
        values,
      });
    }
  };

  render() {
    return (
      // Puxando os valores desejados da label pelo componente de button (linha 40)
      <SafeAreaView style={styles.container}>
        <Display value={this.state.displayValue} />
        <View style={styles.buttons}>
          <Button label="AC" triple onClick={this.clearMemory} />
          <Button label="/" operation onClick={this.setOperation} />
          <Button label="7" onClick={this.addDigit} />
          <Button label="8" onClick={this.addDigit} />
          <Button label="9" onClick={this.addDigit} />
          <Button label="*" operation onClick={this.setOperation} />
          <Button label="4" onClick={this.addDigit} />
          <Button label="5" onClick={this.addDigit} />
          <Button label="6" onClick={this.addDigit} />
          <Button label="-" operation onClick={this.setOperation} />
          <Button label="1" onClick={this.addDigit} />
          <Button label="2" onClick={this.addDigit} />
          <Button label="3" onClick={this.addDigit} />
          <Button label="+" operation onClick={this.setOperation} />
          <Button label="0" double onClick={this.addDigit} />
          <Button label="." onClick={this.addDigit} />
          <Button label="=" operation onClick={this.setOperation} />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttons: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
