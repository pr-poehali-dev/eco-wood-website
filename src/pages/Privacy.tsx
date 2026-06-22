import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-eco-50">
      <div className="bg-eco-800 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 md:px-8 h-16 flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-eco-300 hover:text-white transition-colors text-sm"
          >
            <Icon name="ArrowLeft" size={16} />
            На главную
          </button>
          <div className="w-px h-5 bg-eco-600" />
          <span className="font-display text-lg font-bold">ЭкоДрев</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        <div className="bg-white rounded-3xl border border-eco-100 shadow-sm p-8 md:p-12">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-eco-900 mb-2">
            Политика конфиденциальности
          </h1>
          <p className="text-eco-500 text-sm mb-10">Сайт «ЭкоДрев» · ИНН 522777846257</p>

          <div className="prose prose-eco max-w-none space-y-8 text-eco-800 leading-relaxed">
            <p className="text-eco-600">
              Настоящая Политика определяет порядок обработки и защиты персональных данных пользователей сайта «ЭкоДрев» и разработана во исполнение требований Федерального закона от 27.07.2006 № 152-ФЗ «О персональных данных», Федерального закона от 27.07.2006 № 149-ФЗ «Об информации, информационных технологиях и о защите информации» и иных нормативных актов Российской Федерации.
            </p>

            <section>
              <h2 className="font-display text-xl font-semibold text-eco-900 mb-3 pb-2 border-b border-eco-100">
                1. Состав обрабатываемых данных
              </h2>
              <ul className="space-y-2 text-eco-700">
                <li className="flex gap-2">
                  <span className="text-eco-400 mt-1 shrink-0">—</span>
                  данные, вводимые пользователем в форме обратной связи: имя, номер телефона, адрес электронной почты, текст обращения;
                </li>
                <li className="flex gap-2">
                  <span className="text-eco-400 mt-1 shrink-0">—</span>
                  технические данные: IP-адрес, сведения о браузере и устройстве, cookie-файлы (при наличии).
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-eco-900 mb-3 pb-2 border-b border-eco-100">
                2. Цели и правовые основания обработки
              </h2>
              <ul className="space-y-2 text-eco-700 mb-4">
                <li className="flex gap-2">
                  <span className="text-eco-400 mt-1 shrink-0">—</span>
                  подготовка и направление ответа на обращение пользователя;
                </li>
                <li className="flex gap-2">
                  <span className="text-eco-400 mt-1 shrink-0">—</span>
                  исполнение обязанностей, предусмотренных законодательством РФ;
                </li>
                <li className="flex gap-2">
                  <span className="text-eco-400 mt-1 shrink-0">—</span>
                  обеспечение работоспособности и безопасности сайта.
                </li>
              </ul>
              <p className="text-eco-700">
                Обработка осуществляется на основании согласия субъекта персональных данных, а также в иных случаях, предусмотренных законодательством Российской Федерации.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-eco-900 mb-3 pb-2 border-b border-eco-100">
                3. Порядок хранения и защиты данных
              </h2>
              <p className="text-eco-700">
                Оператор принимает необходимые правовые, организационные и технические меры для защиты персональных данных от неправомерного доступа, изменения, раскрытия или уничтожения. Срок хранения определяется целями обработки и требованиями законодательства.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-eco-900 mb-3 pb-2 border-b border-eco-100">
                4. Права субъекта персональных данных
              </h2>
              <ul className="space-y-2 text-eco-700">
                <li className="flex gap-2">
                  <span className="text-eco-400 mt-1 shrink-0">—</span>
                  получать сведения об обработке своих персональных данных;
                </li>
                <li className="flex gap-2">
                  <span className="text-eco-400 mt-1 shrink-0">—</span>
                  требовать уточнения, блокирования или уничтожения данных в случаях, предусмотренных законом;
                </li>
                <li className="flex gap-2">
                  <span className="text-eco-400 mt-1 shrink-0">—</span>
                  отозвать согласие на обработку персональных данных.
                </li>
              </ul>
            </section>
          </div>

          <div className="mt-10 pt-6 border-t border-eco-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <p className="text-eco-400 text-sm">По вопросам обработки данных: <a href="mailto:klik015@yandex.ru" className="text-eco-600 hover:underline">klik015@yandex.ru</a></p>
            <button onClick={() => navigate('/')} className="btn-primary px-6 py-2.5 text-sm">
              Вернуться на сайт
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
