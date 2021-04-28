class Unit {
  constructor(name, health, criticalDamage) {
    this.name = name
    this.health = health
    this.rechargeTime = (1000 * health) / 100
    this.damage = health / 100
    this.criticalChance = health / 10
    this.criticalDamage = criticalDamage
  }
}

const waitToRecharge = unit =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve('resolved')
    }, unit.rechargeTime)
  })

const numberOfUnits = 5
let units = []
for (let i = 0; i < numberOfUnits; i++) {
  units.push(new Unit(`Unit ${i + 1}`, 100, 5))
}

const getUnit = units => Math.floor(Math.random() * units.length)

const attack = async units => {
  await waitToRecharge(units[0])

  if (units.length <= 1) return units

  let attacker = units[0]

  let defender = attacker
  while (defender === attacker) {
    defender = units[getUnit(units)]
  }

  if (attacker.criticalChance >= Math.floor(Math.random() * 100)) {
    defender.health -= attacker.damage * attacker.criticalDamage
  } else {
    defender.health -= attacker.damage
  }
  console.log(
    `${attacker.name} ---> ${defender.name} (${defender.health} health remaining)`
  )

  if (defender.health <= 0 || attacker.health <= 0) {
    units = units.filter(unit => unit.health > 1)
  }

  defender.rechargeTime = (1000 * defender.health) / 100
  defender.damage = defender.health / 100
  defender.criticalChance = defender.health / 10

  units.sort((a, b) => (a.rechargeTime > b.rechargeTime ? 1 : -1))

  attack(units)
}

attack(units)
