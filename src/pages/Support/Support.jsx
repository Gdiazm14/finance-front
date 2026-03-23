import Layout from '../../components/Layout/Layout'
import styles from './Support.module.css'

export default function Support() {
  return (
    <Layout>
      <div className={styles.container}>
        <p className={styles.title}>Soporte</p>
        <div className={styles.card}>
          <p className={styles.cardTitle}>¿Necesitas ayuda?</p>
          <p className={styles.text}>
            Si tienes alguna pregunta o problema con la aplicación, puedes contactarnos por correo electrónico.
          </p>
          <a className={styles.link} href="mailto:soporte@finance.com">
            soporte@finance.com
          </a>
        </div>
      </div>
    </Layout>
  )
}