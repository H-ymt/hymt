import dayjs from 'dayjs'

type ConvertDateProps = {
  convertDate: string
}

export default function ConvertDate({ convertDate }: ConvertDateProps) {
  const publishedAt = dayjs(convertDate).format('YYYY.MM.DD')
  return (
    <time dateTime={convertDate}>
      {publishedAt}
    </time>
  )
}