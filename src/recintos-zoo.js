class RecintosZoo {
  
  constructor() {
    this.recintos = [
      { numero: 1, bioma: 'savana', tamanhoTotal: 10, animais: [{ animal: 'MACACO', quantidade: 3 }] },
      { numero: 2, bioma: 'floresta', tamanhoTotal: 5, animais: [] },
      { numero: 3, bioma: 'savana e rio', tamanhoTotal: 7, animais: [{ animal: 'GAZELA', quantidade: 1 }] },
      { numero: 4, bioma: 'rio', tamanhoTotal: 8, animais: [] },
      { numero: 5, bioma: 'savana', tamanhoTotal: 9, animais: [{ animal: 'LEAO', quantidade: 1 }] }
    ];

    this.animais = {
      LEAO: { tamanho: 3, bioma: ['savana'], carnivoro: true },
      LEOPARDO: { tamanho: 2, bioma: ['savana'], carnivoro: true },
      CROCODILO: { tamanho: 3, bioma: ['rio'], carnivoro: true },
      MACACO: { tamanho: 1, bioma: ['savana', 'floresta'], carnivoro: false },
      GAZELA: { tamanho: 2, bioma: ['savana'], carnivoro: false },
      HIPOPOTAMO: { tamanho: 4, bioma: ['savana', 'rio'], carnivoro: false }
    };
  }

  analisaRecintos(animal, quantidade) {
    const infoAnimal = this.animais[animal];

    if (!infoAnimal) {
        return { erro: "Animal inválido" };
    }

    if (!Number.isInteger(quantidade) || quantidade <= 0) {
        return { erro: "Quantidade inválida" };
    }

    const recintosViaveis = this.recintos.filter(recinto => {
        const espacoOcupado = recinto.animais.reduce(
            (total, animal) => total + this.animais[animal.animal].tamanho * animal.quantidade, 0
        );

        const espacoNecessario = infoAnimal.tamanho * quantidade;

        // Verifica se o bioma do recinto é adequado
        if (!infoAnimal.bioma.includes(recinto.bioma) && 
            !(infoAnimal.bioma.includes('savana') && recinto.bioma.includes('savana')) && 
            !(infoAnimal.bioma.includes('rio') && recinto.bioma.includes('rio')) &&
            !(infoAnimal.bioma.includes('savana') && recinto.bioma.includes('savana e rio'))) {
            return false;
        }

        // Valida regras específicas
        if (infoAnimal.carnivoro && recinto.animais.length > 0 && recinto.animais[0].animal !== animal) {
            return false;
        }

        if (recinto.animais.some(a => this.animais[a.animal].carnivoro && a.animal !== animal)) {
            // Se o recinto já tem um carnívoro, não deve aceitar outros animais
            return false;
        }

        // Hipopótamo tolera outras espécies só em savana e rio
        if (animal === 'HIPOPOTAMO' && recinto.bioma !== 'savana e rio' && recinto.animais.length > 0) {
            return false;
        }

        // Verifica a condição específica do macaco
        if (animal === 'MACACO' && recinto.animais.length === 0 && quantidade === 1) {
            return false;
        }

        // Checa por múltiplas espécies e calcula o espaço extra necessário
        let espacoExtra = 0;
        if (recinto.animais.length > 0 && !recinto.animais.some(a => a.animal === animal)) {
            espacoExtra = 1; // espaço adicional para múltiplas espécies
        }

        // Verifica se há espaço suficiente
        if (espacoNecessario + espacoExtra > (recinto.tamanhoTotal - espacoOcupado)) {
            return false;
        }

        return true;
    }).map(recinto => {
        const espacoOcupado = recinto.animais.reduce(
            (total, animal) => total + this.animais[animal.animal].tamanho * animal.quantidade, 0
        );
        const espacoNecessario = this.animais[animal].tamanho * quantidade;
        let espacoExtra = 0;

        if (recinto.animais.length > 0 && !recinto.animais.some(a => a.animal === animal)) {
            espacoExtra = 1; // espaço adicional para múltiplas espécies
        }

        const espacoLivre = recinto.tamanhoTotal - espacoOcupado - espacoNecessario - espacoExtra;

        return `Recinto ${recinto.numero} (espaço livre: ${espacoLivre} total: ${recinto.tamanhoTotal})`;
    });

    if (recintosViaveis.length === 0) {
        return { erro: "Não há recinto viável" };
    }

    return { recintosViaveis: recintosViaveis.sort() };
  } 
}

export { RecintosZoo as RecintosZoo };