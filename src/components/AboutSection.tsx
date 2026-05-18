export default function AboutSection() {
  const values = [
    { icon: '🌿', title: 'Экологичность', desc: 'Работаем только с сертифицированными лесными хозяйствами. Для каждого спиленного дерева — три новых.' },
    { icon: '🏆', title: 'Качество ГОСТ', desc: 'Вся продукция проходит контроль качества и соответствует требованиям государственных стандартов.' },
    { icon: '🤝', title: 'Честные цены', desc: 'Работаем напрямую от производителя — без посредников. Фиксированные цены без скрытых наценок.' },
    { icon: '🚚', title: 'Быстрая доставка', desc: 'Собственный автопарк и партнёрские перевозчики. Доставим в любую точку России в срок.' },
  ];

  const team = [
    { name: 'Николай Машков', role: 'Основатель и директор', exp: '20 лет в лесной промышленности' },
    { name: 'Константин Соколов', role: 'Главный технолог', exp: 'Контроль качества продукции' },
    { name: 'Ольга Машкова', role: 'Менеджер по продажам', exp: 'Ваш личный консультант' },
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-eco-100 rounded-full px-4 py-2 text-eco-700 text-sm font-medium mb-4">
            🏢 О нас
          </div>
          <h2 className="section-title mb-4">ЭкоДрев</h2>
          <p className="text-eco-600 text-lg max-w-3xl mx-auto">
            Мы — семейная компания с десятилетней историей. Начинали как небольшая пилорама 
            в Нижегородской области, сегодня — один из крупнейших поставщиков пиломатериалов в регионе.
          </p>
        </div>

        {/* Story + Image */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <h3 className="font-display text-3xl font-semibold text-eco-800">Наша история</h3>
            <div className="space-y-4 text-eco-700 leading-relaxed">
              <p>
                Николай Машков основал небольшое деревообрабатывающее предприятие 
                в Арзамасе. Идея была проста: предоставлять людям качественную 
                древесину по честной цене, прямо от производителя.
              </p>
              <p>
                За 10 лет мы выросли в полноценный деревообрабатывающий комплекс с современным 
                оборудованием, собственной сушильной камерой и автопарком для доставки.
              </p>
              <p>
                Сегодня ЭкоДрев обслуживает более 2000 клиентов по всей России — 
                от частных застройщиков до крупных строительных компаний.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              {[
                { value: '10+', label: 'лет работы' },
                { value: '2000+', label: 'клиентов' },
                { value: '200+', label: 'видов продукции' },
                { value: '50000', label: 'м³ в год' },
              ].map(stat => (
                <div key={stat.label} className="bg-eco-50 rounded-xl p-4 border border-eco-100 text-center">
                  <div className="font-display text-3xl font-bold text-eco-700">{stat.value}</div>
                  <div className="text-eco-600 text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <img
              src="https://cdn.poehali.dev/projects/9893030b-b0f1-44eb-bfc4-cfe8fdbd3ab8/files/0ad3275e-594a-4920-904e-14788a6d0d6c.jpg"
              alt="Производство ЭкоДрев"
              className="rounded-3xl w-full h-[400px] object-cover shadow-xl"
            />
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-eco-900/10 to-transparent" />
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <h3 className="font-display text-3xl font-semibold text-eco-800 text-center mb-10">Наши ценности</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(v => (
              <div key={v.title} className="card-eco p-6 text-center group hover:-translate-y-1 transition-transform duration-300">
                <div className="text-4xl mb-4">{v.icon}</div>
                <h4 className="font-display text-xl font-semibold text-eco-800 mb-3">{v.title}</h4>
                <p className="text-eco-600 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div>
          <h3 className="font-display text-3xl font-semibold text-eco-800 text-center mb-10">Наша команда</h3>
          <div className="grid sm:grid-cols-3 gap-6">
            {team.map(member => (
              <div key={member.name} className="card-eco p-6 text-center">
                <div className="w-20 h-20 bg-eco-100 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4">
                  👤
                </div>
                <h4 className="font-semibold text-eco-800 text-lg">{member.name}</h4>
                <div className="text-eco-600 text-sm font-medium mt-1">{member.role}</div>
                <div className="text-eco-500 text-xs mt-2">{member.exp}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}