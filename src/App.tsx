import { useState } from 'react'

interface Service {
  id: number
  name: string
  price: number
}

interface ServiceItem {
  service: Service
  quantity: number
}

const availableServices: Service[] = [
  { id: 1, name: 'Разработка лендинга', price: 50000 },
  { id: 2, name: 'Интернет-магазин', price: 150000 },
  { id: 3, name: 'Корпоративный портал', price: 300000 },
  { id: 4, name: 'SEO-оптимизация', price: 20000 },
]

export default function ProjectBuilder() {
  const [selectedServices, setSelectedServices] = useState<ServiceItem[]>([])
  const [selectedServiceId, setSelectedServiceId] = useState<number | ''>('')
  const [quantity, setQuantity] = useState('1')

  const totalPrice = selectedServices.reduce(
    (total, item) => total + item.service.price * item.quantity,
    0,
  )

  const numericQuantity = Number(quantity)

  const isQuantityValid =
    Number.isInteger(numericQuantity) && numericQuantity >= 1 && numericQuantity <= 10

  function addService() {
    const service = availableServices.find((s) => s.id === selectedServiceId)

    if (!service || !isQuantityValid)
return

    setSelectedServices((prev) => {
      const existing = prev.find((item) => item.service.id === service.id)

      return existing
        ? prev.map((item) =>
            item.service.id === service.id
              ? { ...item, quantity: item.quantity + numericQuantity }
              : item,
          )
        : [...prev, { service, quantity: numericQuantity }]
    })
    setSelectedServiceId('')
    setQuantity('1')
  }

  function removeService(item: ServiceItem) {
    setSelectedServices((prev) => prev.filter((selectedItem) => selectedItem.service.id !== item.service.id))
  }

  return (
    <div
      className="project-builder"
      style={{ maxWidth: 700, margin: '0 auto', fontFamily: 'sans-serif' }}
    >
      <h2>Состав проекта</h2>

      <div
        className="add-service"
        style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'center' }}
      >
        <select
          onChange={(e) => {
            setSelectedServiceId(Number(e.target.value))
          }}
          value={selectedServiceId}
        >
          <option disabled value="">
            Выберите услугу
          </option>
          {availableServices.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name} — {service.price.toLocaleString()} ₽
            </option>
          ))}
        </select>

        <input
          max={10}
          min={1}
          onChange={(e) => {
            setQuantity(e.target.value)
          }}
          style={{ width: 80, padding: '8px 12px' }}
          type="number"
          value={quantity}
        />

        <button disabled={selectedServiceId === '' || !isQuantityValid} onClick={addService}>
          Добавить
        </button>
      </div>

      {!isQuantityValid && (
        <p style={{ color: 'red', marginBottom: 24 }}>
          Введите целое количество от 1 до 10.
        </p>
      )}

      {selectedServices.length > 0 ? (
        <table className="services-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: 10, textAlign: 'left' }}>Услуга</th>
              <th style={{ border: '1px solid #ddd', padding: 10, textAlign: 'left' }}>
                Цена за ед.
              </th>
              <th style={{ border: '1px solid #ddd', padding: 10, textAlign: 'left' }}>Кол-во</th>
              <th style={{ border: '1px solid #ddd', padding: 10, textAlign: 'left' }}>Сумма</th>
              <th style={{ border: '1px solid #ddd', padding: 10, textAlign: 'left' }} />
            </tr>
          </thead>
          <tbody>
            {selectedServices.map((item) => (
              <tr key={item.service.id}>
                <td style={{ border: '1px solid #ddd', padding: 10 }}>{item.service.name}</td>
                <td style={{ border: '1px solid #ddd', padding: 10 }}>
                  {item.service.price.toLocaleString()} ₽
                </td>
                <td style={{ border: '1px solid #ddd', padding: 10 }}>{item.quantity}</td>
                <td style={{ border: '1px solid #ddd', padding: 10 }}>
                  {(item.service.price * item.quantity).toLocaleString()} ₽
                </td>
                <td style={{ border: '1px solid #ddd', padding: 10 }}>
                  <button onClick={() => removeService(item)}>Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} style={{ border: '1px solid #ddd', padding: 10 }}>
                <strong>Итого:</strong>
              </td>
              <td colSpan={2} style={{ border: '1px solid #ddd', padding: 10 }}>
                <strong>{totalPrice.toLocaleString()} ₽</strong>
              </td>
            </tr>
          </tfoot>
        </table>
      ) : (
        <p style={{ color: '#888', fontStyle: 'italic' }}>Пока не добавлено ни одной услуги</p>
      )}
    </div>
  )
}
