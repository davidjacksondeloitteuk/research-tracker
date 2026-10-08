function formatDate(dateString: string) {
        const date = new Date(dateString);
        const pad = (value: number) => String(value).padStart(2, '0');

        return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${pad(date.getFullYear() % 100)} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    }

export default formatDate;