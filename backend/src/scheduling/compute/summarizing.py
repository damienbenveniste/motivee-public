from transformers import pipeline, AutoTokenizer


class Summarizer:

    SUMMARY_SIZE = 100

    def __init__(self):
        self.summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
        self.tokenizer = AutoTokenizer.from_pretrained("facebook/bart-large-cnn")

    def summarize(self, array):

        if len(array) == 1 and len(self.tokenizer.tokenize(array[0])) <= self.SUMMARY_SIZE:
            return array[0]

        current = ''
        length = 0
        texts = []

        for text in array:
    
            current_length = len(self.tokenizer.tokenize(text))
            if length + current_length > self.tokenizer.max_len_single_sentence:
                texts.append(str(current))
                length = 0
                current = ''
        
            current += text + ' '
            length += current_length

        texts.append(str(current))
        summaries = []
        for text in texts:
            if len(self.tokenizer.tokenize(text)) > self.SUMMARY_SIZE:
                summaries.append(
                    self.summarizer(text, max_length=self.SUMMARY_SIZE)[0]['summary_text']
                )
            else:
                summaries.append(text)

        return self.summarize(summaries)